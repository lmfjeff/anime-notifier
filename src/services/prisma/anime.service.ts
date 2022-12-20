import { Anime, Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { pastSeasons } from '../../utils/date'

export async function getAnimesByStatus(year: string, season: string): Promise<Anime[]> {
  const yearSeason = `${year}-${season}`
  return await prismaClient.anime.findMany({
    where: {
      status: 'currently_airing',
      yearSeason: {
        in: pastSeasons(yearSeason, 3),
      },
    },
    include: {
      animelist: {
        select: {
          score: true,
        },
      },
    },
  })
}

export async function getAnimesBySeason(year: string, season: string): Promise<Anime[]> {
  const yearSeason = `${year}-${season}`
  return await prismaClient.anime.findMany({
    where: {
      yearSeason,
    },
    include: {
      animelist: {
        select: {
          score: true,
        },
      },
    },
  })
}

export async function findAnimeWithExternalPic(): Promise<Anime | null> {
  return await prismaClient.anime.findFirst({
    where: {
      picture: {
        startsWith: 'http',
      },
      type: 'tv',
    },
  })
}

export async function getAnimeById(id: string | undefined): Promise<Anime | null> {
  return await prismaClient.anime.findUnique({
    where: {
      id,
    },
  })
}

export async function getAnimesByIds(animeIds: string[]): Promise<Anime[]> {
  return await prismaClient.anime.findMany({
    where: {
      id: {
        in: animeIds,
      },
    },
  })
}

export async function updateAnime(
  anime: Prisma.XOR<Prisma.AnimeUpdateInput, Prisma.AnimeUncheckedUpdateInput>
): Promise<Anime> {
  const { id, ...data } = anime
  return await prismaClient.anime.update({
    where: {
      id: id as string | undefined,
    },
    data,
  })
}

export async function createAnime(anime: Prisma.AnimeCreateInput): Promise<Anime> {
  return await prismaClient.anime.create({
    data: anime,
  })
}

export async function deleteAnime(id: string): Promise<Anime> {
  return await prismaClient.anime.delete({
    where: {
      id,
    },
  })
}

export async function getAnimeByMalId(malId: string): Promise<Anime | null> {
  return await prismaClient.anime.findFirst({
    where: {
      malId,
    },
  })
}
