import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllAnimesBySeason } from '../../services/animeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  try {
    const params = req.query
    // const { season, nextCursor } = params
    const resp = await getAllAnimesBySeason(params)

    return res.status(200).json(resp)
  } catch (error) {
    return res.status(400).json(error)
  }
}
