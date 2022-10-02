import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

const useLocalDynamodb = process.env.NODE_ENV !== 'production'

// in production, use AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY in env var
export const ddbClientConfig: DynamoDBClientConfig = useLocalDynamodb
  ? {
      endpoint: process.env.DYNAMODB_ENDPOINT,
    }
  : {
      region: process.env.DYNAMODB_REGION,
    }
