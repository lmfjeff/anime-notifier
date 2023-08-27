import { FollowList, Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'

export async function getFollowing(userId: string, options: Prisma.FollowListFindManyArgs) {
  const { where: otherWhere, ...otherOptions } = options
  const where: Prisma.FollowListWhereInput = {
    ...otherWhere,
    user_id: userId,
  }
  const resp = await prismaClient.$transaction([
    prismaClient.followList.findMany({
      where,
      ...otherOptions,
    }),
    prismaClient.followList.count({
      where,
    }),
  ])
  return resp
}

export async function upsertAnimelist(
  animelist: Prisma.Without<Prisma.FollowListCreateInput, Prisma.FollowListUncheckedCreateInput> &
    Prisma.FollowListUncheckedCreateInput
) {
  const { media_id, user_id, score, watch_status } = animelist
  await prismaClient.followList.upsert({
    where: {
      media_id_user_id: {
        media_id,
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

export async function removeFollowing(userId: string, media_id: string) {
  const resp = await prismaClient.followList.delete({
    where: {
      // anime_id_user_id: {
      //   user_id: userId,
      //   anime_id: animeId,
      // },
      media_id_user_id: {
        media_id: parseInt(media_id),
        user_id: userId,
      },
    },
  })
}
