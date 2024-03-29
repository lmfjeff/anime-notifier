import { Media, Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { pastSeasons } from '../../utils/date'
import { seasonIntMap } from '../../constants/animeOption'

export async function searchAnimes(q: string, page: number) {
  const offset = page ? (page - 1) * 20 : 0
  return await prismaClient.media.findMany({
    take: 20,
    skip: offset,
    where: {
      OR: [
        {
          title: {
            path: ['jp'],
            string_contains: q,
          },
        },
        {
          title: {
            path: ['zh'],
            string_contains: q,
          },
        },
        {
          title: {
            path: ['en'],
            string_contains: q,
          },
        },
      ],
    },
  })
}

export async function getAnimesByStatus(year: string, season: string): Promise<Media[]> {
  const yearSeason = `${year}-${season}`
  return await prismaClient.media.findMany({
    where: {
      // airingStatus: 'RELEASING',
      // yearSeason: {
      //   in: pastSeasons(yearSeason, 3),
      // },
      // AND: [
      //   {
      //     year: parseInt(year),
      //     season,
      //   },
      // ],
    },
    include: {
      followlist: {
        select: {
          score: true,
        },
      },
    },
  })
}

export async function getAnimesBySeason(year: string, season: string): Promise<Media[]> {
  const past3seasonslist = pastSeasons(parseInt(year), seasonIntMap[season], 3)
  return await prismaClient.media.findMany({
    where: {
      OR: [
        {
          airingStatus: 'RELEASING',
          OR: past3seasonslist,
        },
        {
          year: parseInt(year),
          season: seasonIntMap[season] || null,
        },
      ],
      dayOfWeek: {
        not: Prisma.DbNull,
      },
      time: {
        not: Prisma.DbNull,
      },
    },
    include: {
      followlist: {
        select: {
          score: true,
        },
      },
    },
  })
}

// todo
export async function findAnimeWithExternalPic(): Promise<Media | null> {
  return await prismaClient.media.findFirst({
    // where: {
    //   picture: {
    //     startsWith: 'http',
    //   },
    //   type: 'tv',
    // },
  })
}

export async function getAnimeById(id: string | undefined): Promise<Media | null> {
  if (!id) return null
  return await prismaClient.media.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      genres: true,
    },
  })
}

export async function getAnimesByIds(animeIds: string[]): Promise<Media[]> {
  return await prismaClient.media.findMany({
    where: {
      id: {
        in: animeIds.map(id => parseInt(id)),
      },
    },
  })
}

export async function updateAnime(
  anime: Prisma.XOR<Prisma.MediaUpdateInput, Prisma.MediaUncheckedUpdateInput>
): Promise<Media> {
  const { id, ...data } = anime
  return await prismaClient.media.update({
    where: {
      id: id as number,
    },
    data,
  })
}

export async function createAnime(anime: Prisma.MediaCreateInput): Promise<Media> {
  return await prismaClient.media.create({
    data: anime,
  })
}

export async function deleteAnime(id: number): Promise<Media> {
  return await prismaClient.media.delete({
    where: {
      id,
    },
  })
}

export async function getAnimeByMalId(malId: string): Promise<Media | null> {
  return await prismaClient.media.findFirst({
    where: {
      idExternal: {
        path: ['mal'],
        equals: parseInt(malId),
      },
    },
  })
}
