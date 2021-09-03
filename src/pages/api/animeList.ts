import type { NextApiRequest, NextApiResponse } from 'next'
import { getAnimesByIds } from '../../services/animeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const resp = await getAnimesByIds(req.body)
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
