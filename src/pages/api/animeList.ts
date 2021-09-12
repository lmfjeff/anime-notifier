import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getAnimesByIds } from '../../services/animeService'
import { getFollowing } from '../../services/followingService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || !session.userId) throw 'not login for animeList api'

  if (req.method === 'GET') {
    try {
      const resp = await getFollowing({ userId: session.userId })
      if (resp.anime.length === 0) return res.status(200).json({ animes: [], total: 0 })

      const { page } = req.query
      const index = parseInt(page as string)
      const response = await getAnimesByIds({ anime: resp.anime.slice(index, index + 50) })

      const sortedAnimes = response.animes.sort((a: any, b: any) => resp.anime.indexOf(a.id) - resp.anime.indexOf(b.id))

      return res.status(200).json({ animes: sortedAnimes, total: resp.anime.length })
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
