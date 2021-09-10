import { Box, Text, Wrap, Flex, RadioGroup, Radio } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import {
  jp2hk,
  parseWeekday,
  reorderByDate,
  sortDay,
  sortTime,
  toWeekday,
  transformAnimeLateNight,
} from '../utils/date'
import { AnimeCard } from './AnimeCard'
import styles from '../styles/AnimeList.module.css'

type Props = {
  animes: any[]
  followingAnimes: string[]
  addFollowing: (title: string) => void
  removeFollowing: (title: string) => void
  sort: string
}

// todo lazy load the compact view

export const AnimeList = ({ animes, followingAnimes, addFollowing, removeFollowing, sort }: Props) => {
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

  const reorderAnime = reorderByDate(sortedAnimes)

  const weekdayRef = useRef<HTMLDivElement[]>(new Array(7))

  const [activeN, setActiveN] = useState<number>()

  const scrollTo = async (val: string) => {
    weekdayRef.current[parseInt(val)].scrollIntoView()
    setActiveN(parseInt(val))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setActiveN(undefined)
  }

  return (
    <>
      <Flex justifyContent="center">
        <RadioGroup onChange={scrollTo}>
          <Flex flexWrap="wrap">
            {reorderAnime.map((dayAnimes, n) => (
              <Radio key={n} value={n} size="md" mx={2} my={1}>
                {dayAnimes.day.replace('星期', '')}
              </Radio>
            ))}
          </Flex>
        </RadioGroup>
      </Flex>
      {/*  */}
      <Text>收錄動畫數: {tvAnimes.length} </Text>
      {sort === 'weekly' && (
        <>
          {reorderAnime.map((dayAnimes, n) => (
            <Box key={dayAnimes.day} my={4} ref={el => (weekdayRef.current[n] = el!!)} className={styles.title}>
              <Text fontSize="2xl" display="inline-block" className={n === activeN ? styles.blink : ''}>
                {dayAnimes.day} {n === 0 && '(今日)'}
              </Text>
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
