import { Animelist, Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAnimeById } from '../../services/prisma/anime.service'
// import { getAnimeById } from '../../services/dynamodb/animeService'
import { upsertAnimelist, getFollowing, removeFollowing } from '../../services/prisma/animelist.service'
// import { addFollowing, getFollowing, removeFollowing } from '../../services/dynamodb/followingService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const { userId } = session
  if (!userId) return res.status(401).end()

  if (req.method === 'GET') {
    try {
      const options: Prisma.AnimelistFindManyArgs = {} //orderBy: { score: { sort: 'desc', nulls: 'last' } }
      const { page } = req.query
      const sort = req.query.sort as Prisma.AnimelistOrderByWithRelationInput
      const order = (req.query.order as Prisma.SortOrder) || 'asc'
      const watch_status = req.query.status as string
      const offsetPage = parseInt(page as string) - 1
      const pageSize = 25
      if (watch_status && watch_status !== 'all') {
        options.where = {
          watch_status,
        }
      }
      if (sort === 'score') {
        options.orderBy = {
          score: {
            sort: order,
            nulls: 'last',
          },
        }
      }
      if (sort === 'updatedAt') {
        options.orderBy = {
          updatedAt: order,
        }
      }
      if (page) {
        options.include = { anime: true }
        options.take = pageSize
        options.skip = offsetPage * pageSize
      }
      const [followingAnimes, count] = await getFollowing(userId, options)
      let resp: Record<string, unknown> = {
        animes: followingAnimes,
      }
      if (page) {
        resp = {
          ...resp,
          total: count,
          page_size: pageSize,
        }
      }
      res.status(200).json(resp)
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const animelist = req.body as Animelist
      const anime = await getAnimeById(animelist.anime_id)
      animelist.user_id = userId
      if (anime === null) return res.status(400).json({ message: 'anime id not exist' })

      await upsertAnimelist(animelist)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { animeId } = req.query as { animeId: string }
      await removeFollowing(userId, animeId)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
