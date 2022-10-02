import { GetParameterCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

const ssmClient = new SSMClient({})
const malAuthKey = 'mal-auth'

// get access token, refresh token, lastUpdated
// if not exist, throw error?
export async function getMalAuth() {
  // const existingStore = await ssmClient.send(new DescribeParametersCommand());
  // const parameterList = existingStore.Parameters;
  // const parameterNameList = parameterList.map((parameter) => parameter.Name);
  // if (!parameterNameList.includes(malAuthKey)) {
  //   console.log("there is no mal token in parameter store, something is wrong");
  //   throw Error("no token");
  // }

  const getResp = await ssmClient.send(new GetParameterCommand({ Name: malAuthKey, WithDecryption: true }))
  const malAuth = JSON.parse(getResp.Parameter?.Value || '')
  return malAuth
}

export async function putMalAuth(malAuth: { accessToken: string; refreshToken: string; lastUpdated: string }) {
  await ssmClient.send(
    new PutParameterCommand({
      Name: malAuthKey,
      Value: JSON.stringify(malAuth),
      Overwrite: true,
      Type: 'SecureString',
    })
  )
}
