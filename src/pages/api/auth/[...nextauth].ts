import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter'
import { ddbDocClient } from '../../../lib/ddbDocClient'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prismaClient } from '../../../lib/prisma'
import { loginUser } from '../../../services/prisma/user.service'
import { userLoginSchema } from '../../../utils/validation'

// https://next-auth.js.org/configuration/options
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { username, password } = await userLoginSchema.validate(credentials)
        return await loginUser(username, password)
      },
    }),
  ],
  // adapter: DynamoDBAdapter(ddbDocClient),
  adapter: PrismaAdapter(prismaClient),

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async redirect({ baseUrl }): Promise<string> {
      return baseUrl
    },
    async jwt({ token, account, isNewUser, profile, user }) {
      // console.log('token', token)
      // console.log('account', account)
      // console.log('isNewUser', isNewUser)
      // console.log('profile', profile)
      // console.log('user', user)
      return token
    },
    async session({ session, token, user }) {
      session.userId = token?.sub || user?.id
      // console.log('session', session)
      return session
    },
  },

  debug: false,
})
