import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllAnimesBySeason, updateAnime } from '../../services/animeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // const { season, nextCursor } = req.query
      const resp = await getAllAnimesBySeason(req.query)
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'PUT') {
    try {
      const resp = await updateAnime({ anime: req.body.anime })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
