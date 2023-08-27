import { Box, Button, Flex, Grid, Text, Wrap, Icon, Select } from '@chakra-ui/react'
import { Media, FollowList } from '@prisma/client'
import { Dayjs } from 'dayjs'
import { motion } from 'framer-motion'
import produce from 'immer'
import { useEffect, useMemo, useRef, useState } from 'react'
import { weekdayOption, weekdayTcOption } from '../constants/animeOption'
import { AnimeOverview } from '../types/anime'
import {
  gethkNow,
  parseWeekday,
  reorderByDate,
  reorderIndexFromSunday,
  reorderIndexFromToday,
  sortDay,
} from '../utils/date'
import { AnimeCard } from './AnimeCard'

type AnimeListProps = {
  animes: Media[]
  followingAnimes: FollowList[]
  isFollowingLoading: boolean
  upsertAnimelist: (animelist: Partial<FollowList>) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  sort: string
  signedIn: boolean
  now: Dayjs
  followFilter: string | null
  thisSeason: boolean
}

// todo lazy load the compact view
export const AnimeList = ({
  animes,
  followingAnimes,
  isFollowingLoading,
  upsertAnimelist,
  removeFollowing,
  sort,
  signedIn,
  now,
  followFilter,
  thisSeason,
}: AnimeListProps) => {
  const hour = now.hour()
  const day = now.day()
  const dayShiftedBy6hr = useMemo(() => {
    const tmp = hour <= 5 ? day - 1 : day
    if (tmp < 0) return tmp + 7
    return tmp
  }, [hour, day])

  // const [hour, setHour] = useState(0)
  // const [day, setDay] = useState(0)

  // useEffect(() => {
  //   const now = gethkNow()
  //   setHour(now.hour())
  //   setDay(now.day())
  // }, [])

  // const isFollowed = (id: string) => {
  //   if (followingAnimes) {
  //     return followingAnimes.some(fa => fa.anime_id === id)
  //   } else return false
  // }

  const animesByDayReordered = useMemo(() => {
    const animesByDay: Media[][] = [[], [], [], [], [], [], [], []]
    animes.forEach(anime => {
      if (parseWeekday(anime.dayOfWeek?.jp) === -1) {
        animesByDay[7].push(anime)
      } else {
        animesByDay[parseWeekday(anime.dayOfWeek?.jp)].push(anime)
      }
    })
    const tmp = reorderByDate(animesByDay, hour, day)
    return tmp
  }, [animes, day, hour])

  const animeSorted = useMemo(() => {
    if (sort === 'compact') {
      return produce(animes, draft => {
        draft.sort(sortDay)
      })
    }
    if (sort === 'anilist_score') {
      return produce(animes, draft => {
        draft.sort((a, b) => (b?.scoreExternal?.anilist || -1) - (a?.scoreExternal?.anilist || -1))
      })
    }
    if (sort === 'score') {
      return produce(animes, draft => {
        draft.sort(
          (a, b) => (typeof b.score === 'number' ? b.score : -1) - (typeof a.score === 'number' ? a.score : -1)
        )
      })
    }
    return []
  }, [animes, sort])

  const weekdayRef = useRef<HTMLDivElement[]>(new Array())

  const [activeN, setActiveN] = useState<number>()

  const scrollTo = async (n: number) => {
    const num = reorderIndexFromToday(n, hour, day)
    weekdayRef.current[num]?.scrollIntoView()
    setActiveN(num)
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // setActiveN(undefined)
  }

  return (
    <>
      <Text my={2}>收錄動畫數: {animes.length} </Text>
      {sort === 'weekly' && (
        <>
          <Flex alignItems={'center'} justifyContent={'center'} flexWrap={'wrap'} gap={1}>
            {/* <Text mx={3} fontSize={'lg'}>
              跳到
            </Text> */}
            {weekdayOption.map((val, n) => (
              <Button
                key={val}
                bg={'white'}
                onClick={() => scrollTo(n)}
                boxShadow={n === dayShiftedBy6hr ? '0 0 3px black' : ''}
              >
                {weekdayTcOption[val].replace('星期', '')}
              </Button>
            ))}
          </Flex>
          {animesByDayReordered.map((dayAnimes, n) => {
            if (dayAnimes.length === 0) return null
            return (
              <Box key={n} my={4} ref={el => (weekdayRef.current[n] = el!!)} sx={{ scrollMarginTop: [50, 50, 0] }}>
                {/* <motion.div
                  animate={activeN === n ? { backgroundColor: [null, '#f0ff0080', '#f0ff0080', '#ff00'] } : {}}
                  transition={{ repeat: 1, duration: 0.5, times: [0, 0.33, 0.66, 1] }}
                >
                </motion.div> */}
                <Text fontSize="2xl" display="inline-block" bgColor={activeN === n ? 'yellow' : undefined}>
                  {weekdayTcOption[weekdayOption[reorderIndexFromSunday(n, hour, day)]] || '星期未知'}{' '}
                  {n === 0 && '(今日)'}
                </Text>
                {/* <Wrap overflow="hidden" justify={['center', null, 'start']}> */}
                <Grid gridTemplateColumns={'repeat(auto-fill, minmax(160px, 1fr))'} gap={2}>
                  {dayAnimes.map((anime: any) => (
                    <AnimeCard
                      key={anime.id}
                      anime={anime}
                      followStatus={followingAnimes?.find(({ media_id }) => media_id === anime.id)}
                      upsertAnimelist={upsertAnimelist}
                      removeFollowing={removeFollowing}
                      now={now}
                      sort={sort}
                      followFilter={followFilter}
                      showMenu={signedIn && !isFollowingLoading}
                      thisSeason={thisSeason}
                    />
                  ))}
                </Grid>
              </Box>
            )
          })}
        </>
      )}
      {['compact', 'anilist_score', 'score'].includes(sort) && (
        <Grid gridTemplateColumns={'repeat(auto-fill, minmax(160px, 1fr))'} gap={2}>
          {animeSorted.map((anime: any) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              followStatus={followingAnimes?.find(({ media_id }) => media_id === anime.id)}
              upsertAnimelist={upsertAnimelist}
              removeFollowing={removeFollowing}
              now={now}
              sort={sort}
              followFilter={followFilter}
              showMenu={signedIn && !isFollowingLoading}
              thisSeason={thisSeason}
            />
          ))}
        </Grid>
      )}
    </>
  )
}
