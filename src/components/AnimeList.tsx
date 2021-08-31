import { Box, Button, SimpleGrid, Stack, Text, Wrap } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
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
  hasNextPage: boolean
  fetchNextPage: () => unknown
  isFetching: boolean
  followingAnimes: string[]
  addFollowing: (title: string) => void
  removeFollowing: (title: string) => void
  sort: string
}

// todo center the animeList (even in narrow view)
// todo lazy load the compact view

const AnimeList = ({
  animes,
  hasNextPage,
  fetchNextPage,
  isFetching,
  followingAnimes,
  addFollowing,
  removeFollowing,
  sort,
}: Props) => {
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

  const weeklyView = (
    <>
      {reorderByDate(sortedAnimes).map(dayAnimes => (
        <Box key={dayAnimes.day} my={4}>
          <Text>{dayAnimes.day}</Text>
          <Wrap overflow="hidden">
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
  )

  const compactView = (
    <Wrap overflow="hidden" my={4}>
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
  )

  return (
    <>
      <Text>收錄動畫數: {tvAnimes.length} </Text>
      <InfiniteScroll
        dataLength={animes.length} // This is important field to render the next data
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Loading isLoading={isFetching} />}
        endMessage={<End />}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
      >
        {sort === 'weekly' ? weeklyView : null}
        {sort === 'compact' ? compactView : null}
      </InfiniteScroll>
      {hasNextPage ? <Button onClick={fetchNextPage}>Load more manually</Button> : null}
    </>
  )
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? <h4>Loading...</h4> : null
}

const End = () => {
  return <h4>Yay! You have seen it all</h4>
}

export default AnimeList
