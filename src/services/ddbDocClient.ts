import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  // },
})

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false,
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true,
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false,
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false,
}

const translateConfig = { marshallOptions, unmarshallOptions }

const ddbDocClient = DynamoDBDocument.from(ddbClient, translateConfig)

export { ddbDocClient }
