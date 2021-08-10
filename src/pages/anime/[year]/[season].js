import { Box, Button, Flex } from '@chakra-ui/react'
import { useCallback } from 'react'
import { getAnimesBySeason } from '../../../services/dynamodb'
import { useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Image from 'next/image'
import AnimeList from '../../../components/AnimeList'

export default function AnimeListBySeason({ resp, params }) {
  const { animes, nextCursor } = resp
  const { year, season } = params

  const fetchAnimeList = useCallback(
    async ({ pageParam }) => {
      const resp = await fetch(`/api/anime?year=${year}&season=${season}&nextCursor=${JSON.stringify(pageParam)}`)
      console.log('fetching using react query')
      const data = await resp.json()
      return {
        data: data.animes,
        nextCursor: data.nextCursor,
      }
    },
    [year, season]
  )

  const queryKey = ['animes', year, season]

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
    <div>
      <Flex flexDir="column" align="center">
        <Link href="/anime" passHref>
          <Button>Back to List</Button>
        </Link>
        <h1>Anime List</h1>
        <p>Anime Title</p>
        <p>Anime Season</p>
        {/* <InfiniteScroll
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
              <p>{anime.yearSeason}</p>
              <img src={anime.picture} alt={anime.title} height="300px" width="300px" />
            </div>
          ))}
        </InfiniteScroll> */}

        <Button onClick={fetchNextPage}>Load more manually</Button>
        {/* <Button
          onClick={() => {
            fetch(`/api/anime?season=${year}&nextCursor=${JSON.stringify(nextCursor)}`)
          }}
        >
          fetch next page
        </Button> */}
      </Flex>
      <AnimeList
        animes={toShowAnimes}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
      />
    </div>
  )
}

export const getStaticProps = async ({ params }) => {
  // const { year, season } = params
  const resp = await getAnimesBySeason(params)

  return {
    props: { resp, params },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
