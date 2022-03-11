import { ddbDocClient } from './ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getFollowing(req: { userId: string }): Promise<{ animeIds: string[] }> {
  const { userId } = req
  const input: GetCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    ProjectionExpression: 'anime',
  }
  const resp = await ddbDocClient.get(input)
  const animeIds = (resp?.Item?.anime as string[]) || []

  return {
    animeIds,
  }
}

async function updateFollowingByList(userId: string, animeList: string[]): Promise<void> {
  const input: UpdateCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    UpdateExpression: 'SET anime = :animeList',
    ExpressionAttributeValues: {
      ':animeList': animeList,
    },
  }
  await ddbDocClient.update(input)
}

export async function addFollowing(req: { animeId: string; userId: string }): Promise<void> {
  const { animeId, userId } = req

  const { animeIds: oldList } = await getFollowing({ userId })
  if (oldList.includes(animeId)) return

  const newList = oldList
  newList.push(animeId)
  await updateFollowingByList(userId, newList)
}

export async function removeFollowing(req: { animeId: string; userId: string }): Promise<void> {
  const { animeId, userId } = req

  const { animeIds: oldList } = await getFollowing({ userId })

  const newList = oldList.filter(id => id !== animeId)
  await updateFollowingByList(userId, newList)
}
