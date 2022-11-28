import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { createAnime, deleteAnime, updateAnime } from '../../services/prisma/anime.service'
// import { createAnime, deleteAnime, updateAnime } from '../../services/dynamodb/animeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: 'not admin' })
  }

  if (req.method === 'PUT') {
    try {
      await updateAnime(req.body.anime)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      await createAnime(req.body.anime)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteAnime(req.query.id as string)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
