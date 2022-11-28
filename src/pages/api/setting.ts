import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getSubscription, removeSubscription, upsertSubscription } from '../../services/prisma/subscribe.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const { userId } = session
  console.log('🚀 ~ file: setting.ts ~ line 9 ~ handler ~ userId', req.body)
  if (!userId) return res.status(401).end()

  if (req.method === 'GET') {
    try {
      const sub = await getSubscription(userId)
      res.status(200).json({
        subscriptions: sub,
      })
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const subscription = {
        ...req.body,
        user_id: userId,
      }
      const sub = await upsertSubscription(subscription)
      res.status(200).json(sub)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const device = (req.query.device as string) || undefined
      const sub = await removeSubscription({ device, user_id: userId })
      res.status(200).json(sub)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
