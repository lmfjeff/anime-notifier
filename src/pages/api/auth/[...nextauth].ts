import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter'
import { ddbDocClient } from '../../../services/ddbDocClient'

// https://next-auth.js.org/configuration/options
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  adapter: DynamoDBAdapter(ddbDocClient),

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async redirect({ baseUrl }): Promise<string> {
      return baseUrl
    },
    async session({ session, token }) {
      session.userId = token.sub
      return session
    },
  },

  debug: false,
})
