import { ddbDocClient } from './ddbDocClient'
import {
  QueryCommandOutput,
  QueryCommandInput,
  GetCommandInput,
  GetCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb'

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
      'id,yearSeason,title,picture,alternative_titles,startDate,endDate,summary,genres,#type,#status,dayOfWeek,#time,#source,studios',
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

// todo implement yup validation (server side / client side?)
export async function updateAnime(request: any) {
  const { anime } = request
  const now = new Date()

  let update_expression = 'set #updatedAt=:updatedAt,'
  let expression_attribute_names: { [key: string]: any } = { '#updatedAt': 'updatedAt' }
  let expression_attribute_values: { [key: string]: any } = { ':updatedAt': now.toISOString() }

  // set update input based on request.anime object
  Object.entries(anime).forEach(([key, val]) => {
    if (key !== 'id') {
      update_expression += `#${key}=:${key},`
      expression_attribute_names = { ...expression_attribute_names, ...{ ['#' + key]: key } }
      expression_attribute_values = { ...expression_attribute_values, ...{ [':' + key]: val } }
    }
  })
  update_expression = update_expression.slice(0, -1)

  const input: UpdateCommandInput = {
    TableName: 'Animes',
    Key: { id: anime.id },
    UpdateExpression: update_expression,
    ExpressionAttributeNames: expression_attribute_names,
    ExpressionAttributeValues: expression_attribute_values,
    ReturnValues: 'UPDATED_NEW',
  }
  const resp: UpdateCommandOutput = await ddbDocClient.update(input)
  return { resp }
}