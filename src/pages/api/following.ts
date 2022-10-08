import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAnimeById } from '../../services/dynamodb/animeService'
import { addFollowing, getFollowing, removeFollowing } from '../../services/dynamodb/followingService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { userId } = session as { userId?: string }
  if (!session || !userId) return res.status(401).end()

  if (req.method === 'GET') {
    try {
      const { animeIds } = await getFollowing({ userId })
      res.status(200).json({ animeIds })
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const { animeId } = req.body
      const { anime } = await getAnimeById({ id: animeId })
      if (anime === null) return res.status(400).json({ message: 'anime id not exist' })

      await addFollowing({ animeId, userId })
      res.status(200).end()
    } catch (error) {
      res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { animeId } = req.query as { animeId: string }
      await removeFollowing({ animeId, userId })
      res.status(200).end()
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
