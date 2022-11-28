import { ddbDocClient } from '../../lib/ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getFollowing(userId: string): Promise<string[]> {
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

  return animeIds
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

export async function addFollowing(userId: string, animeId: string): Promise<void> {
  const oldList = await getFollowing(userId)
  if (oldList.includes(animeId)) return

  const newList = oldList
  newList.push(animeId)
  await updateFollowingByList(userId, newList)
}

export async function removeFollowing(userId: string, animeId: string): Promise<void> {
  const oldList = await getFollowing(userId)

  const newList = oldList.filter(id => id !== animeId)
  await updateFollowingByList(userId, newList)
}
