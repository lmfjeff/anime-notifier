import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import webPush from 'web-push'
import { getSub } from '../../services/dynamodb/subscribeService'

// api for sending test push notification
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || !process.env.WEB_PUSH_PRIVATE_KEY) {
    return res.status(500).end()
  }

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  )

  const session = await getSession({ req })
  const { userId } = session as { userId?: string }
  if (!session || !userId) return res.status(401).end()

  if (req.method === 'POST') {
    try {
      const sub = await getSub(userId)
      if (!sub) return res.status(400).json({ message: 'not subscribed to web push' })
      const response = await webPush.sendNotification(
        JSON.parse(sub),
        JSON.stringify({ title: 'Anime Notifier', message: '測試通知成功' })
      )
      res.writeHead(response.statusCode, response.headers).end(response.body)
    } catch (err: any) {
      if ('statusCode' in err) {
        res.writeHead(err.statusCode, err.headers).end(err.body)
      } else {
        res.status(500).end()
      }
    }
  }

  res.status(405).end()
}
