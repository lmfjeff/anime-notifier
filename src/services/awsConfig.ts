import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

const useLocalDynamodb = process.env.NODE_ENV !== 'production'

export const ddbClientConfig: DynamoDBClientConfig = {
  ...(useLocalDynamodb
    ? { endpoint: process.env.DYNAMODB_ENDPOINT }
    : {
        region: process.env.DYNAMODB_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
      }),
}
