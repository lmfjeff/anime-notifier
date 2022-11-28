import { Box, Text, Wrap } from '@chakra-ui/layout'
import { Anime } from '@prisma/client'
import React, { useMemo } from 'react'
import { weekdayOption, weekdayTcOption } from '../constants/animeOption'
import { AnimeOverview } from '../types/anime'
import { gethkNow, parseWeekday, reorderByDate, reorderIndexFromSunday } from '../utils/date'
import { AdminAnimeCard } from './AdminAnimeCard'

type AdminAnimeListProps = {
  animes: Anime[]
  deleteAnime: (id: string) => Promise<void>
  hideAnime: (id: string, hide: boolean) => Promise<void>
}

export const AdminAnimeList = ({ animes, deleteAnime, hideAnime }: AdminAnimeListProps) => {
  const now = gethkNow()
  const hour = now.hour()
  const day = now.day()

  const animesByDayReordered = useMemo(() => {
    const animesByDay: Anime[][] = [[], [], [], [], [], [], [], []]
    animes.forEach(anime => {
      if (parseWeekday(anime.dayOfWeek) === -1) {
        animesByDay[7].push(anime)
      } else {
        animesByDay[parseWeekday(anime.dayOfWeek)].push(anime)
      }
    })
    const tmp = reorderByDate(animesByDay, hour, day)
    return tmp
  }, [animes, day, hour])

  return (
    <>
      <Text>收錄動畫數: {animes.length} </Text>
      {animesByDayReordered.map((dayAnimes, n) => (
        <Box key={n} my={4}>
          <Text fontSize="2xl" display="inline-block">
            {weekdayTcOption[weekdayOption[reorderIndexFromSunday(n, hour, day)]]} {n === 0 && '(今日)'}
          </Text>
          <Wrap overflow="hidden" justify={['center', null, 'start']}>
            {dayAnimes.map((anime: any) => (
              <AdminAnimeCard key={anime.id} anime={anime} deleteAnime={deleteAnime} hideAnime={hideAnime} />
            ))}
          </Wrap>
        </Box>
      ))}
    </>
  )
}
