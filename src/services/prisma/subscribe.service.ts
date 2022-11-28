import { Prisma, Webpush } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'

export async function getSubscription(userId: string) {
  return await prismaClient.webpush.findMany({
    where: {
      user_id: userId,
    },
  })
}

export async function upsertSubscription(
  subscription: Prisma.Without<Prisma.WebpushCreateInput, Prisma.WebpushUncheckedCreateInput> &
    Prisma.WebpushUncheckedCreateInput
) {
  const { device, active, push_subscription, useragent, user_id } = subscription
  return await prismaClient.webpush.upsert({
    where: {
      device,
    },
    update: {
      active,
      push_subscription,
      useragent,
      user_id,
    },
    create: subscription,
  })
}

export async function removeSubscription(subscription: Partial<Webpush>) {
  const { device, user_id } = subscription
  return await prismaClient.webpush.deleteMany({
    where: {
      device,
      user_id,
    },
  })
}
