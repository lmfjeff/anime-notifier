import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined
}

export const prismaClient = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient
