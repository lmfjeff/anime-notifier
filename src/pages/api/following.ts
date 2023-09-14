import { FollowList, Prisma } from '@prisma/client'
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
      const options: Prisma.FollowListFindManyArgs = {} //orderBy: { score: { sort: 'desc', nulls: 'last' } }
      const { page } = req.query
      const sort = req.query.sort // todo type?
      const order = (req.query.order as Prisma.SortOrder) || 'asc'
      const watch_status = req.query.status as string
      const media_id = req.query.media_id as string
      const offsetPage = parseInt(page as string) - 1
      const pageSize = 25
      if (watch_status && watch_status !== 'all') {
        options.where = {
          watch_status,
        }
      }
      if (media_id) {
        options.where = {
          ...options.where,
          media_id: parseInt(media_id),
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
      if (sort === 'year') {
        options.orderBy = [
          {
            media: {
              year: order,
            },
          },
          {
            media: {
              season: order,
            },
          },
        ]
      }
      if (page) {
        options.include = { media: true }
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
      const { media_id, ...rest } = req.body as Partial<FollowList>
      const anime = await getAnimeById(media_id?.toString())
      if (!media_id) return res.status(400)
      if (anime === null) return res.status(400).json({ message: 'anime id not exist' })

      await upsertAnimelist({ media_id, user_id: userId, ...rest })
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { media_id } = req.query as { media_id: string }
      await removeFollowing(userId, media_id)
      res.status(200).end()
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }

  res.status(405).end()
}
