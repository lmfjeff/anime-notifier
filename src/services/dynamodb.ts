import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocument,
  QueryCommandOutput,
  QueryCommandInput,
  UpdateCommandInput,
  GetCommandInput,
  GetCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

const ddbDocClient = DynamoDBDocument.from(dynamoClient, { marshallOptions: { removeUndefinedValues: true } })

async function getAnimesBySeason(request: any): Promise<any> {
  const { year, season, nextCursor } = request
  const input: QueryCommandInput = {
    TableName: 'Animes',
    IndexName: 'YearSeasonIndex',
    Limit: 30,
    ExpressionAttributeValues: {
      ':yearSeason': `${year}-${season}`,
    },
    KeyConditionExpression: 'yearSeason = :yearSeason',
    ...(nextCursor ? { ExclusiveStartKey: JSON.parse(nextCursor) } : {}),
    ProjectionExpression: 'id,yearSeason,title,picture,dayOfWeek,#time,genres,alternative_titles,#type,#status,#source',
    ExpressionAttributeNames: {
      '#time': 'time',
      '#type': 'type',
      '#status': 'status',
      '#source': 'source',
    },
  }
  const resp: QueryCommandOutput = await ddbDocClient.query(input)
  if (!resp.LastEvaluatedKey || !resp.Items) {
    // No more
    return resp
  }
  const { Items: nextItems, ...rest } = await getAnimesBySeason({
    ...request,
    nextCursor: JSON.stringify(resp.LastEvaluatedKey),
  })
  return {
    Items: [...resp.Items, ...(nextItems ?? [])],
    ...rest,
  }
}

export async function getAllAnimesBySeason(request: any): Promise<any> {
  const resp = await getAnimesBySeason(request)
  return {
    animes: resp.Items,
    nextCursor: resp.LastEvaluatedKey ? resp.LastEvaluatedKey : null,
  }
}

export async function getAnimeById(request: any): Promise<any> {
  const { id } = request
  const input: GetCommandInput = {
    TableName: 'Animes',
    Key: { id },
    ExpressionAttributeNames: {
      '#time': 'time',
      '#type': 'type',
      '#status': 'status',
      '#source': 'source',
    },
    ProjectionExpression:
      'id,yearSeason,title,picture,alternative_titles,startDate,endDate,summary,genres,#type,#status,dayOfWeek,#time,#source,studio',
  }
  const resp: GetCommandOutput = await ddbDocClient.get(input)
  if (resp.Item) {
    return {
      anime: resp.Item,
    }
  } else {
    return {
      anime: null,
    }
  }
}

export async function addFollowing(req: any): Promise<any> {
  const { anime, userId } = req
  const now = new Date()
  const input: UpdateCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    UpdateExpression: 'SET #anime = list_append(if_not_exists(#anime, :emptyList), :anime), #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#anime': 'anime',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':anime': [anime],
      ':emptyList': [],
      ':updatedAt': now.toISOString(),
    },
    ReturnValues: 'UPDATED_NEW',
  }
  const resp = await ddbDocClient.update(input)
  return {
    resp,
  }
}

export async function getFollowing(req: any): Promise<any> {
  const { userId } = req
  const input: GetCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    ExpressionAttributeNames: {
      '#anime': 'anime',
    },
    ProjectionExpression: '#anime',
  }
  const resp = await ddbDocClient.get(input)
  const anime = resp.Item?.anime || null

  return {
    anime,
  }
}
