import { Box, Button, Flex, Text, Wrap } from '@chakra-ui/react'
import { motion } from 'framer-motion'
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
  animes: AnimeOverview[]
  followingAnimeIds: string[]
  addFollowing: (id: string) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  sort: string
  signedIn: boolean
}

type WeekdayButtonProps = {
  text: string
  day: number
  scrollTo: (n: number) => Promise<void>
  today: number
}

const WeekdayButton = ({ text, day, scrollTo, today }: WeekdayButtonProps) => {
  return (
    <Button bg={'white'} m={1} onClick={() => scrollTo(day)} boxShadow={today === day ? '0 0 3px black' : ''}>
      {text.replace('星期', '')}
    </Button>
  )
}

// todo lazy load the compact view
export const AnimeList = ({
  animes,
  followingAnimeIds,
  addFollowing,
  removeFollowing,
  sort,
  signedIn,
}: AnimeListProps) => {
  const [hour, setHour] = useState(0)
  const [day, setDay] = useState(0)

  useEffect(() => {
    const now = gethkNow()
    setHour(now.hour())
    setDay(now.day())
  }, [])

  const isFollowed = (id: string) => {
    if (followingAnimeIds) {
      return followingAnimeIds.includes(id)
    } else return false
  }

  const animesByDayReordered = useMemo(() => {
    const animesByDay: AnimeOverview[][] = [[], [], [], [], [], [], [], []]
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
          <Flex alignItems={'center'} justifyContent={'center'} flexWrap={'wrap'}>
            <Text mx={3} fontSize={'lg'}>
              跳到:
            </Text>
            {weekdayOption.map((val, n) => (
              <WeekdayButton key={n} day={n} text={weekdayTcOption[val]} scrollTo={scrollTo} today={day} />
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
                  {weekdayTcOption[weekdayOption[reorderIndexFromSunday(n, hour, day)]]} {n === 0 && '(今日)'}
                </Text>
                <Wrap overflow="hidden" justify={['center', null, 'start']}>
                  {dayAnimes.map((anime: any) => (
                    <AnimeCard
                      key={anime.id}
                      anime={anime}
                      followed={isFollowed(anime.id)}
                      addFollowing={addFollowing}
                      removeFollowing={removeFollowing}
                      signedIn={signedIn}
                    />
                  ))}
                </Wrap>
              </Box>
            )
          })}
        </>
      )}
      {sort === 'compact' && (
        <Wrap overflow="hidden" my={4} justify={['center', null, 'start']}>
          {animes.sort(sortDay).map((anime: any) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              followed={isFollowed(anime.id)}
              addFollowing={addFollowing}
              removeFollowing={removeFollowing}
              signedIn={signedIn}
            />
          ))}
        </Wrap>
      )}
    </>
  )
}
