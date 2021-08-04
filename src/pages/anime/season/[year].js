import { Box, Button, Flex } from '@chakra-ui/react'
import { useCallback } from 'react'
import { getAnimesBySeason } from '../../../services/dynamodb'
import { useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function AnimeListByYear({ resp, params }) {
  const { animes, nextCursor } = resp
  const { year } = params

  const fetchAnimeList = useCallback(
    async ({ pageParam }) => {
      const resp = await fetch(`/api/anime?season=${year}&nextCursor=${JSON.stringify(pageParam)}`)
      console.log('fetching using react query')
      const data = await resp.json()
      return {
        data: data.animes,
        nextCursor: data.nextCursor,
      }
    },
    [year]
  )

  const queryKey = ['animes', year]

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    initialData: { pages: [{ data: resp.animes, nextCursor: resp.nextCursor }], pageParams: [] },
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })

  const toShowAnimes = data?.pages.map(({ data }) => data).flat() || []

  return (
    <Flex flexDir="column" align="center">
      <h1>Anime List</h1>
      <p>Anime Title</p>
      <p>Anime Season</p>
      <Button
        onClick={() => {
          fetch('/api/anime?season=2019')
        }}
      >
        call /api/anime?season=2019
      </Button>

      <InfiniteScroll
        dataLength={toShowAnimes.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={isFetching ? <h4>Loading...</h4> : null}
        endMessage={<h4>Yay! You have seen it all</h4>}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
      >
        {toShowAnimes.map(anime => (
          <div key={anime.title} style={{ border: 'solid', borderColor: 'black', borderWidth: '1px' }}>
            <p>{anime.title}</p>
            <p>{anime.season}</p>
            <p>{anime.picture}</p>
          </div>
        ))}
      </InfiniteScroll>
      <Button onClick={fetchNextPage}>Load more manually</Button>
      {/* <Button
        onClick={() => {
          fetch(`/api/anime?season=${year}&nextCursor=${JSON.stringify(nextCursor)}`)
        }}
      >
        fetch next page
      </Button> */}
    </Flex>
  )
}

export const getStaticProps = async ({ params }) => {
  const { year } = params
  const resp = await getAnimesBySeason({ season: parseInt(year) })

  return {
    props: { resp, params },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
