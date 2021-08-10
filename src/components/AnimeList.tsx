import { SimpleGrid } from '@chakra-ui/react'
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
}

const AnimeList = ({ animes, hasNextPage, fetchNextPage, isFetching }: Props) => {
  return (
    <InfiniteScroll
      dataLength={animes.length} // This is important field to render the next data
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<Loading isLoading={isFetching} />}
      endMessage={<End />}
      scrollThreshold={0.95}
      scrollableTarget="scrollableDiv"
    >
      <SimpleGrid minChildWidth="144px" spacing={3}>
        {animes.map(anime => (
          <AnimeCard key={anime.title} anime={anime} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  )
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? <h4>Loading...</h4> : null
}

const End = () => {
  return <h4>Yay! You have seen it all</h4>
}

export default AnimeList
