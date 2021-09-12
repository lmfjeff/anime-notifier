import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { addFollowing, getFollowing, removeFollowing } from '../../services/followingService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || !session.userId) throw 'not login for following api'

  if (req.method === 'GET') {
    try {
      const resp = await getFollowing({ userId: session.userId })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const resp = await addFollowing({ anime: req.body.anime, userId: session.userId })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const resp = await removeFollowing({ anime: req.query.anime, userId: session.userId })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
