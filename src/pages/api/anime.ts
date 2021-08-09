import type { NextApiRequest, NextApiResponse } from 'next'
import { getAnimesBySeason } from '../../services/dynamodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  try {
    const params = req.query
    // const { season, nextCursor } = params
    const resp = await getAnimesBySeason(params)

    return res.status(200).json(resp)
  } catch (error) {
    return res.status(400).json(error)
  }
}
