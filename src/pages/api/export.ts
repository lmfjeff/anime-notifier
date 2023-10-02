import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getFollowing } from '../../services/prisma/animelist.service'
import { Prisma } from '@prisma/client'
import { AsyncParser } from '@json2csv/node'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const { userId } = session
  if (!userId) return res.status(401).end()

  if (req.method === 'GET') {
    const options: Prisma.FollowListFindManyArgs = {
      orderBy: {
        updatedAt: 'asc',
      },
      include: {
        media: true,
      },
    }
    const [followingAnimes] = await getFollowing(userId, options)
    const exportAnimes = (
      followingAnimes as unknown[] as Prisma.FollowListGetPayload<{ include: { media: true } }>[]
    ).map(
      ({ media, user_id, media_id, ...rest }): Record<string, any> => ({
        ...rest,
        ...media.idExternal,
      })
    )
    const parser = new AsyncParser()
    const csv = await parser.parse(exportAnimes).promise()

    return res.status(200).send(csv)
  }

  res.status(405).end()
}
