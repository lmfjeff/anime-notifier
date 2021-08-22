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

// todo check
export async function updateAnime(request: any) {
  const { anime } = request
  const input: UpdateCommandInput = {
    TableName: 'Animes',
    Key: { id: anime.id },
    UpdateExpression:
      'set #yearSeason=:yearSeason, #title=:title, #picture=:picture, #alternative_titles=:alternative_titles, #startDate=:startDate, #endDate=:endDate, #summary=:summary, #genres=:genres, #type=:type, #status=:status, #dayOfWeek=:dayOfWeek, #time=:time, #source=:source, #studio=:studio',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#yearSeason': 'yearSeason',
      '#title': 'title',
      '#picture': 'picture',
      '#alternative_titles': 'alternative_titles',
      '#startDate': 'startDate',
      '#endDate': 'endDate',
      '#summary': 'summary',
      '#genres': 'genres',
      '#type': 'type',
      '#status': 'status',
      '#dayOfWeek': 'dayOfWeek',
      '#time': 'time',
      '#source': 'source',
      '#studio': 'studio',
    },
    ExpressionAttributeValues: {
      ':yearSeason': anime.yearSeason,
      ':title': anime.title,
      ':picture': anime.picture,
      ':alternative_titles': anime.alternative_titles,
      ':startDate': anime.startDate,
      ':endDate': anime.endDate,
      ':summary': anime.summary,
      ':genres': anime.genres,
      ':type': anime.type,
      ':status': anime.status,
      ':dayOfWeek': anime.dayOfWeek,
      ':time': anime.time,
      ':source': anime.source,
      ':studio': anime.studio,
    },
    ReturnValues: 'UPDATED_NEW',
  }
  const resp: UpdateCommandOutput = await ddbDocClient.update(input)
  return { resp }
}
