import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getSub, updateSub } from '../../services/subscribeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || !session.userId) throw 'not login'

  if (req.method === 'GET') {
    try {
      const resp = await getSub({ userId: session.userId })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const resp = await updateSub({ sub: req.body.sub, userId: session.userId })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
