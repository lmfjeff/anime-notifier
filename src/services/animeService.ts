import { ddbDocClient } from './ddbDocClient'
import {
  QueryCommandInput,
  GetCommandInput,
  UpdateCommandInput,
  BatchGetCommandInput,
  PutCommandInput,
  DeleteCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { nanoid } from 'nanoid'
import { pastSeasons } from '../utils/date'
import { AnimeDetailListResponse, AnimeDetailResponse, AnimeListResponse, GetAnimesBySeasonRequest } from '../types/api'
import { AnimeDetail, AnimeOverview, FollowingAnime } from '../types/anime'
import dayjs from 'dayjs'

// include only animes currently_airing in past 3 season, filter out this season currently_airing
export async function getAnimesByStatus(request: GetAnimesBySeasonRequest): Promise<AnimeDetailListResponse> {
  const { year, season } = request
  if (!year || !season) throw Error('Need to specify search year and season')

  const yearSeason = `${year}-${season}`
  let allAnimes = [] as AnimeDetail[]
  let nextCursor

  do {
    const input: QueryCommandInput = {
      TableName: 'Animes',
      IndexName: 'StatusIndex',
      Limit: 100,
      ExpressionAttributeValues: {
        ':status': 'currently_airing',
      },
      KeyConditionExpression: '#status = :status',
      ...(nextCursor ? { ExclusiveStartKey: JSON.parse(nextCursor) } : {}),
      ProjectionExpression:
        'id,yearSeason,title,picture,alternative_titles,startDate,endDate,summary,genres,#type,#status,dayOfWeek,#time,#source,studios,numEpisodes,malId,hide',
      ExpressionAttributeNames: {
        '#time': 'time',
        '#type': 'type',
        '#status': 'status',
        '#source': 'source',
      },
    }
    const response = await ddbDocClient.query(input)
    const batchAnimes = (response.Items as AnimeDetail[]) || []
    allAnimes = [...allAnimes, ...batchAnimes]
    nextCursor = JSON.stringify(response.LastEvaluatedKey)
    if (!response.LastEvaluatedKey || !response.Items) {
      break
    }
  } while (nextCursor)

  // only retrive current_airing animes of past 3 seasons
  const filteredAnimes = allAnimes.filter(anime => pastSeasons(yearSeason, 3).includes(anime.yearSeason))
  return {
    animes: filteredAnimes,
  }
}

export async function getAnimesBySeason(request: GetAnimesBySeasonRequest): Promise<AnimeDetailListResponse> {
  // const resp = await _getAnimesBySeason(request)
  // return {
  //   animes: (resp.Items as AnimeOverview[]) || [],
  // }
  const { year, season } = request
  if (!year || !season) throw Error('Need to specify search year and season')

  const yearSeason = `${year}-${season}`
  let allAnimes = [] as AnimeDetail[]
  let nextCursor

  do {
    const input: QueryCommandInput = {
      TableName: 'Animes',
      IndexName: 'YearSeasonIndex',
      Limit: 100,
      ExpressionAttributeValues: {
        ':yearSeason': yearSeason,
      },
      KeyConditionExpression: 'yearSeason = :yearSeason',
      ...(nextCursor ? { ExclusiveStartKey: JSON.parse(nextCursor) } : {}),
      ProjectionExpression:
        'id,yearSeason,title,picture,alternative_titles,startDate,endDate,summary,genres,#type,#status,dayOfWeek,#time,#source,studios,numEpisodes,malId,hide',
      ExpressionAttributeNames: {
        '#time': 'time',
        '#type': 'type',
        '#status': 'status',
        '#source': 'source',
      },
    }
    const response = await ddbDocClient.query(input)
    const batchAnimes = (response.Items as AnimeDetail[]) || []
    allAnimes = [...allAnimes, ...batchAnimes]
    nextCursor = JSON.stringify(response.LastEvaluatedKey)
    if (!response.LastEvaluatedKey || !response.Items) {
      break
    }
  } while (nextCursor)

  return {
    animes: allAnimes,
  }
}

export async function getAnimeById(request: { id: string }): Promise<AnimeDetailResponse> {
  const { id } = request
  const input: GetCommandInput = {
    TableName: 'Animes',
    Key: { id },
  }
  const resp = await ddbDocClient.get(input)
  return {
    anime: (resp.Item as AnimeDetail) || null,
  }
}

export async function getAnimesByIds(request: { animeIds: string[] }): Promise<{ animes: FollowingAnime[] }> {
  const { animeIds } = request
  if (!animeIds || animeIds.length === 0) return { animes: [] }
  const keyArray = animeIds.map(id => ({ id }))
  const input: BatchGetCommandInput = {
    RequestItems: {
      Animes: { Keys: keyArray, ProjectionExpression: 'id,title' },
    },
  }
  const resp = await ddbDocClient.batchGet(input)

  return { animes: (resp.Responses?.Animes as FollowingAnime[]) || [] }
}

// todo implement yup validation (server side / client side?)
export async function updateAnime(request: { anime: AnimeDetail }): Promise<void> {
  const { anime } = request
  const now = dayjs()

  let update_expression = 'set #updatedAt = :updatedAt,'
  let expression_attribute_names: Record<string, string> = { '#updatedAt': 'updatedAt' }
  let expression_attribute_values: Record<string, unknown> = { ':updatedAt': now.toISOString() }

  // set update input based on request.anime object
  for (const property in anime) {
    if (property !== 'id') {
      update_expression += ` #${property} = :${property},`
      expression_attribute_names['#' + property] = property
      expression_attribute_values[':' + property] = anime[property as keyof AnimeDetail]
    }
  }
  update_expression = update_expression.slice(0, -1)

  const input: UpdateCommandInput = {
    TableName: 'Animes',
    Key: { id: anime.id },
    UpdateExpression: update_expression,
    ExpressionAttributeNames: expression_attribute_names,
    ExpressionAttributeValues: expression_attribute_values,
  }
  await ddbDocClient.update(input)
}

export async function createAnime(request: { anime: AnimeDetail }): Promise<void> {
  const { anime } = request
  const now = dayjs()

  const input: PutCommandInput = {
    TableName: 'Animes',
    Item: { ...anime, id: nanoid(), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  }

  await ddbDocClient.put(input)
}

export async function deleteAnime(request: { id: string }): Promise<void> {
  const { id } = request
  const input: DeleteCommandInput = {
    TableName: 'Animes',
    Key: { id },
  }
  await ddbDocClient.delete(input)
}

export async function getAnimeByMalId(request: { malId: string }): Promise<AnimeDetailResponse> {
  const { malId } = request

  const input: QueryCommandInput = {
    TableName: 'Animes',
    IndexName: 'MalIdIndex',
    Limit: 1,
    ExpressionAttributeValues: {
      ':malId': malId,
    },
    KeyConditionExpression: 'malId = :malId',
    ProjectionExpression:
      'id,yearSeason,title,picture,alternative_titles,startDate,endDate,summary,genres,#type,#status,dayOfWeek,#time,#source,studios,numEpisodes,malId,hide',
    ExpressionAttributeNames: {
      '#time': 'time',
      '#type': 'type',
      '#status': 'status',
      '#source': 'source',
    },
  }

  const resp = await ddbDocClient.query(input)
  return {
    anime: (resp.Items?.[0] as AnimeDetail) || null,
  }
}
