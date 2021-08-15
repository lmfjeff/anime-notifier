import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, QueryCommandOutput, QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

const ddbDocClient = DynamoDBDocument.from(dynamoClient, { marshallOptions: { removeUndefinedValues: true } })

export async function getAnimesBySeason(request: any): Promise<any> {
  const { year, season, nextCursor } = request
  const input: QueryCommandInput = {
    TableName: 'Animes',
    Limit: 30,
    ExpressionAttributeValues: {
      ':yearSeason': `${year}-${season}`,
    },
    KeyConditionExpression: 'yearSeason = :yearSeason',
    ...(nextCursor ? { ExclusiveStartKey: JSON.parse(nextCursor) } : {}),
  }
  const resp: QueryCommandOutput = await ddbDocClient.query(input)
  return {
    animes: resp.Items,
    nextCursor: resp.LastEvaluatedKey ? resp.LastEvaluatedKey : null,
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
