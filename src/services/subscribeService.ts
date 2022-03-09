import { ddbDocClient } from './ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getSub(req: { userId: string }): Promise<{ sub: string | null }> {
  const { userId } = req
  const input: GetCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    ExpressionAttributeNames: {
      '#sub': 'sub',
    },
    ProjectionExpression: '#sub',
  }
  const resp = await ddbDocClient.get(input)
  const sub = resp?.Item?.sub || null

  return {
    sub,
  }
}

export async function updateSub(req: { sub: string | null; userId: string }): Promise<{ sub: string | null }> {
  const { userId, sub } = req
  const input: UpdateCommandInput = {
    TableName: 'next-auth',
    Key: {
      pk: `USER#${userId}`,
      sk: `USER#${userId}`,
    },
    UpdateExpression: 'SET #sub = :sub',
    ExpressionAttributeNames: {
      '#sub': 'sub',
    },
    ExpressionAttributeValues: {
      ':sub': sub || null,
    },
    ReturnValues: 'UPDATED_NEW',
  }
  const { Attributes } = await ddbDocClient.update(input)
  return {
    sub: Attributes?.sub || null,
  }
}
