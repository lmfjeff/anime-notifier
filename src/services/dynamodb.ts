import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, QueryCommandOutput, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

const ddbDocClient = DynamoDBDocument.from(dynamoClient, { marshallOptions: { removeUndefinedValues: true } })

export async function getAnimesBySeason(request: any): Promise<any> {
  const { season, nextCursor } = request
  const input: QueryCommandInput = {
    TableName: 'Animes',
    IndexName: 'SeasonIndex',
    Limit: 15,
    ExpressionAttributeValues: {
      ':season': season,
    },
    KeyConditionExpression: 'season = :season',
    ...(nextCursor ? { ExclusiveStartKey: JSON.parse(nextCursor) } : {}),
  }
  const resp: QueryCommandOutput = await ddbDocClient.query(input)
  return {
    animes: resp.Items,
    nextCursor: resp.LastEvaluatedKey ? resp.LastEvaluatedKey : null,
  }
}
