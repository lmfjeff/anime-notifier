import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getFollowing, upsertAnimelist } from '../../services/prisma/animelist.service'
import { FollowList, Media, Prisma } from '@prisma/client'
import { AsyncParser, Transform } from '@json2csv/node'
import { StreamParser } from '@json2csv/plainjs'
import { createReadStream, createWriteStream } from 'fs'
import path from 'path'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import csvtojson from 'csvtojson'
import { prismaClient } from '../../lib/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const { userId } = session
  if (!userId) return res.status(401).end()

  if (req.method === 'POST') {
    const data: any = await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })
    const csvString = await fs.readFile(data?.files?.file?.[0]?.filepath, {
      encoding: 'utf8',
    })
    const followlist = await csvtojson().fromString(csvString)

    for (const item of followlist) {
      const { watch_status, score, createdAt, updatedAt, mal, anilist } = item
      const media = await prismaClient.media.findFirst({
        where: {
          idExternal: {
            path: ['anilist'],
            equals: parseInt(anilist),
          },
        },
      })
      if (!media) continue
      await upsertAnimelist({
        media_id: media.id,
        user_id: userId,
        score: parseFloat(score) || null,
        watch_status,
        createdAt,
        updatedAt,
      })
    }
    res.status(200).end()

    // const [followingAnimes] = await getFollowing(userId, options)
    // const exportAnimes = (
    //   followingAnimes as unknown[] as Prisma.FollowListGetPayload<{ include: { media: true } }>[]
    // ).map(
    //   ({ media, user_id, media_id, ...rest }): Record<string, any> => ({
    //     ...rest,
    //     ...media.idExternal,
    //   })
    // )
    // const parser = new AsyncParser()
    // const csv = await parser.parse(exportAnimes).promise()

    // return res.status(200).send(csv)
  }

  res.status(405).end()
}
