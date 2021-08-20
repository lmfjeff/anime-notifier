import { Button, SimpleGrid, Stack, Text, Wrap } from '@chakra-ui/react'
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
}

// todo center the animeList (even in narrow view)
// todo lazy load the compact view

const AnimeList = ({ animes, hasNextPage, fetchNextPage, isFetching, followingAnimes, addFollowing }: Props) => {
  const [sort, setSort] = useState('weekly')
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

  animes
    .filter(filterByTV)
    .map(jp2hk)
    .map(transformAnimeLateNight)
    .sort(sortTime)
    .forEach((anime: any) => {
      if (parseWeekday(anime.dayOfWeek) === -1) {
        sortedAnimes[7].animes.push(anime)
      } else {
        sortedAnimes[parseWeekday(anime.dayOfWeek)].animes.push(anime)
      }
    })

  const weeklyView = (
    <>
      {reorderByDate(sortedAnimes).map(dayAnimes => (
        <div key={dayAnimes.day}>
          <Text>{dayAnimes.day}</Text>
          <Wrap>
            {dayAnimes.animes.map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} followed={isFollowed(anime.id)} addFollowing={addFollowing} />
            ))}
          </Wrap>
        </div>
      ))}
    </>
  )

  const compactView = (
    <Wrap overflow="hidden">
      {animes
        .filter(filterByTV)
        .map(transformAnimeLateNight)
        .map((anime: any) => (
          <AnimeCard key={anime.id} anime={anime} followed={isFollowed(anime.id)} addFollowing={addFollowing} />
        ))}
    </Wrap>
  )

  return (
    <>
      <Button onClick={() => setSort('weekly')}>Weekly View</Button>
      <Button onClick={() => setSort('compact')}>Compact View</Button>
      <Text>Total: {animes.length} </Text>
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
