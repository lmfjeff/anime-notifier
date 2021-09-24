import { ddbDocClient } from './ddbDocClient'
import { UpdateCommandInput, GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getSub(req: any): Promise<any> {
  try {
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
    const sub = resp.Item?.sub || []

    return {
      sub,
    }
  } catch (error) {
    console.log(error)
    return {
      sub: [],
    }
  }
}

export async function updateSub(req: any): Promise<any> {
  try {
    const { userId, sub } = req
    const now = new Date()
    const input: UpdateCommandInput = {
      TableName: 'next-auth',
      Key: {
        pk: `USER#${userId}`,
        sk: `USER#${userId}`,
      },
      UpdateExpression: 'SET #sub = :sub, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#sub': 'sub',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':sub': sub,
        ':updatedAt': now.toISOString(),
      },
      ReturnValues: 'UPDATED_NEW',
    }
    const resp = await ddbDocClient.update(input)
    return resp
  } catch (error) {
    console.log(error)
    return {}
  }
}
