import { Box, Button, SimpleGrid, Stack, Text, Wrap, Flex } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  jp2hk,
  parseWeekday,
  reorderByDate,
  sortDay,
  sortTime,
  toWeekday,
  transformAnimeLateNight,
} from '../utils/date'
import AnimeCard from './AnimeCard'

type Props = {
  animes: any[]
  followingAnimes: string[]
  addFollowing: (title: string) => void
  removeFollowing: (title: string) => void
  sort: string
}

// todo lazy load the compact view

const AnimeList = ({ animes, followingAnimes, addFollowing, removeFollowing, sort }: Props) => {
  const isFollowed = (id: string) => {
    if (followingAnimes) {
      return followingAnimes.includes(id)
    } else return false
  }
  const filterByHavingDayOfWeek = (a: any) => !!a.dayOfWeek
  const filterByTV = (a: any) => a.type === 'tv'
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

  const tvAnimes = animes.filter(filterByTV).map(jp2hk).map(transformAnimeLateNight).sort(sortTime)

  tvAnimes.forEach((anime: any) => {
    if (parseWeekday(anime.dayOfWeek) === -1) {
      sortedAnimes[7].animes.push(anime)
    } else {
      sortedAnimes[parseWeekday(anime.dayOfWeek)].animes.push(anime)
    }
  })

  return (
    <>
      <Text>收錄動畫數: {tvAnimes.length} </Text>
      {sort === 'weekly' && (
        <>
          {reorderByDate(sortedAnimes).map(dayAnimes => (
            <Box key={dayAnimes.day} my={4}>
              <Text fontSize="2xl">{dayAnimes.day}</Text>
              <Wrap overflow="hidden" justify={['center', null, 'start']}>
                {dayAnimes.animes.map((anime: any) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    followed={isFollowed(anime.id)}
                    addFollowing={addFollowing}
                    removeFollowing={removeFollowing}
                  />
                ))}
              </Wrap>
            </Box>
          ))}
        </>
      )}
      {sort === 'compact' && (
        <Wrap overflow="hidden" my={4} justify={['center', null, 'start']}>
          {tvAnimes.sort(sortDay).map((anime: any) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              followed={isFollowed(anime.id)}
              addFollowing={addFollowing}
              removeFollowing={removeFollowing}
            />
          ))}
        </Wrap>
      )}
    </>
  )
}

export default AnimeList
