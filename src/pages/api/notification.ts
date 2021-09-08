import type { NextApiRequest, NextApiResponse } from 'next'
import webPush from 'web-push'

if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || !process.env.WEB_PUSH_PRIVATE_KEY) {
  throw 'not yet set environment variables for web-push public/private key'
}

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const { subscription } = req.body

    webPush
      .sendNotification(subscription, JSON.stringify({ title: 'Anime Notifier', message: 'Push Notification Works' }))
      .then(response => {
        res.writeHead(response.statusCode, response.headers).end(response.body)
      })
      .catch(err => {
        if ('statusCode' in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body)
        } else {
          console.error(err)
          res.statusCode = 500
          res.end()
        }
      })
  } else {
    res.statusCode = 405
    res.end()
  }
}
