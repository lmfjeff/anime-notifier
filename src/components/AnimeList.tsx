import { Button, SimpleGrid } from '@chakra-ui/react'
import * as React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import AnimeCard from './AnimeCard'

// import { AppleDailyArticleCard } from '../ArticleCard'
// import { Article } from '../../types/appleDailyArticle'

type Props = {
  animes: any[]
  hasNextPage: boolean
  fetchNextPage: () => unknown
  isFetching: boolean
  followingAnimes: string[]
  addFollowing: (title: string) => void
}

const AnimeList = ({ animes, hasNextPage, fetchNextPage, isFetching, followingAnimes, addFollowing }: Props) => {
  const isFollowed = (title: string) => {
    if (followingAnimes) {
      return followingAnimes.includes(title)
    } else return false
  }
  return (
    <>
      <InfiniteScroll
        dataLength={animes.length} // This is important field to render the next data
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Loading isLoading={isFetching} />}
        endMessage={<End />}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
      >
        <SimpleGrid minChildWidth="144px" spacing={3} mx={10}>
          {animes.map(anime => (
            <AnimeCard key={anime.title} anime={anime} followed={isFollowed(anime.title)} addFollowing={addFollowing} />
          ))}
        </SimpleGrid>
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
