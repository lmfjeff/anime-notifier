import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getSub, updateSub } from '../../services/subscribeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { userId } = session as { userId?: string }
  if (!session || !userId) return res.status(401).end()

  if (req.method === 'GET') {
    try {
      const { sub } = await getSub({ userId: userId })
      res.status(200).json({ sub })
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const { sub } = await updateSub({ sub: req.body?.sub, userId })
      res.status(200).json({ sub })
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
