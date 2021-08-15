import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { addFollowing } from '../../services/dynamodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const params = req.query
    const { anime } = params
    const session = await getSession({ req })
    if (session && session.userId) {
      const { userId } = session
      const resp = await addFollowing({ anime, userId })
      return res.status(200).json(resp)
    } else {
      throw 'not logined'
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}
