import { ddbDocClient } from './ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

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
  const anime = resp.Item?.anime || []

  return {
    anime,
  }
}

async function updateFollowingByList(userId: string, animeList: string[]): Promise<any> {
  const now = new Date()
  const input: UpdateCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    UpdateExpression: 'SET #anime = :animeList, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#anime': 'anime',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':animeList': animeList,
      ':updatedAt': now.toISOString(),
    },
    ReturnValues: 'UPDATED_NEW',
  }
  const resp = await ddbDocClient.update(input)
  return resp
}

// todo check whether the added anime is valid anime id (exist in db)?
export async function addFollowing(req: any): Promise<any> {
  const { anime, userId } = req

  // check whether anime already followed
  const existing = await getFollowing(req)
  if (existing.anime && existing.anime.includes(anime)) throw 'already followed'

  const newList = existing.anime || []
  newList.push(anime)
  const resp = await updateFollowingByList(userId, newList)
  return { resp }
}

export async function removeFollowing(req: any): Promise<any> {
  const { anime, userId } = req

  const existing = await getFollowing(req)
  if (!existing.anime) throw 'empty list'

  const newList = existing.anime.filter((a: string) => a !== anime)
  const resp = await updateFollowingByList(userId, newList)
  return { resp }
}
