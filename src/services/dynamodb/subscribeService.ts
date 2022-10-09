import { ddbDocClient } from '../../lib/ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getSub(userId: string): Promise<string | null> {
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

  return sub
}

export async function updateSub(sub: string | null, userId: string): Promise<string | null> {
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
      ':sub': sub,
    },
    ReturnValues: 'UPDATED_NEW',
  }
  const { Attributes } = await ddbDocClient.update(input)
  return Attributes?.sub || null
}
