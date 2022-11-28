import { Animelist, Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'

export async function getFollowing(userId: string, options: Prisma.AnimelistFindManyArgs) {
  const { where: otherWhere, ...otherOptions } = options
  const where: Prisma.AnimelistWhereInput = {
    ...otherWhere,
    user_id: userId,
  }
  const resp = await prismaClient.$transaction([
    prismaClient.animelist.findMany({
      where,
      ...otherOptions,
    }),
    prismaClient.animelist.count({
      where,
    }),
  ])
  return resp
}

export async function upsertAnimelist(
  animelist: Prisma.Without<Prisma.AnimelistCreateInput, Prisma.AnimelistUncheckedCreateInput> &
    Prisma.AnimelistUncheckedCreateInput
) {
  const { anime_id, user_id, score, watch_status } = animelist
  await prismaClient.animelist.upsert({
    where: {
      anime_id_user_id: {
        anime_id,
        user_id,
      },
    },
    update: {
      score,
      watch_status,
    },
    create: animelist,
  })
}

export async function removeFollowing(userId: string, animeId: string) {
  const resp = await prismaClient.animelist.delete({
    where: {
      anime_id_user_id: {
        user_id: userId,
        anime_id: animeId,
      },
    },
  })
}
