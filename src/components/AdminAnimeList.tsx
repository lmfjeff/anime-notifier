import { Box, Text, Wrap } from '@chakra-ui/layout'
import React from 'react'
import { jp2hk, parseWeekday, reorderByDate, sortTime, transformAnimeLateNight } from '../utils/date'
import { AdminAnimeCard } from './AdminAnimeCard'

type Props = {
  animes: any[]
}

export const AdminAnimeList = ({ animes }: Props) => {
  const sortedAnimes = [
    { day: '星期日', animes: new Array() },
    { day: '星期一', animes: new Array() },
    { day: '星期二', animes: new Array() },
    { day: '星期三', animes: new Array() },
    { day: '星期四', animes: new Array() },
    { day: '星期五', animes: new Array() },
    { day: '星期六', animes: new Array() },
    { day: '星期未定/不定', animes: new Array() },
  ]

  const transformedAnimes = animes.map(jp2hk).map(transformAnimeLateNight).sort(sortTime)

  transformedAnimes.forEach((anime: any) => {
    if (parseWeekday(anime.dayOfWeek) === -1) {
      sortedAnimes[7].animes.push(anime)
    } else {
      sortedAnimes[parseWeekday(anime.dayOfWeek)].animes.push(anime)
    }
  })

  const reorderAnime = reorderByDate(sortedAnimes)

  return (
    <>
      <Text>收錄動畫數: {transformedAnimes.length} </Text>
      {reorderAnime.map((dayAnimes, n) => (
        <Box key={dayAnimes.day} my={4}>
          <Text fontSize="2xl" display="inline-block">
            {dayAnimes.day} {n === 0 && '(今日)'}
          </Text>
          <Wrap overflow="hidden" justify={['center', null, 'start']}>
            {dayAnimes.animes.map((anime: any) => (
              <AdminAnimeCard key={anime.id} anime={anime} />
            ))}
          </Wrap>
        </Box>
      ))}
    </>
  )
}
