import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAnimesByIds } from '../../services/dynamodb/animeService'
import { getFollowing } from '../../services/dynamodb/followingService'
import { FollowingAnime } from '../../types/anime'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { userId } = session as { userId?: string }
  if (!session || !userId) return res.status(401).end()

  if (req.method === 'GET') {
    try {
      const { animeIds } = await getFollowing({ userId })
      const { page } = req.query as { page: string }
      const index = parseInt(page)
      const animesIdsPortion = animeIds.reverse().slice(index, index + 50)
      const { animes } = await getAnimesByIds({ animeIds: animesIdsPortion })

      // cope with deleted animes
      if (animes.length < animesIdsPortion.length) {
        const retrivedAnimeIds = animes.map(({ id }) => id)
        const deletedAnimeIds = animesIdsPortion.filter(id => !retrivedAnimeIds.includes(id))
        deletedAnimeIds.forEach(id => animes.push({ id, title: '[已刪除的動畫]' }))
      }

      const sortedAnimes = animes.sort(
        (a: FollowingAnime, b: FollowingAnime) => animeIds.indexOf(a.id) - animeIds.indexOf(b.id)
      )

      res.status(200).json({ animes: sortedAnimes, total: animeIds.length })
    } catch (error) {
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
