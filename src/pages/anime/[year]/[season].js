import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useCallback } from 'react'
import { getAnimesBySeason } from '../../../services/dynamodb'
import { useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import AnimeList from '../../../components/AnimeList'
import { range } from 'ramda'

export default function AnimeListBySeason({ resp, params }) {
  const { animes, nextCursor } = resp
  const { year, season } = params
  const yearList = range(2019, 2023)
  const seasonList = ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'UNDEFINED']
  const router = useRouter()

  // todo change fetch to axios
  const fetchAnimeList = useCallback(
    async ({ pageParam }) => {
      const resp = await fetch(
        `/api/anime?year=${year}&season=${season}&nextCursor=${pageParam ? JSON.stringify(pageParam) : ''}`
      )
      console.log(pageParam)
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
    enabled: false,
    initialData: { pages: [{ data: resp.animes, nextCursor: resp.nextCursor }], pageParams: [] },
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })

  const toShowAnimes = data?.pages.map(({ data }) => data).flat() || []

  return (
    <>
      <Flex flexDir="column" align="center">
        <Link href="/anime" passHref>
          <Button>Back to List</Button>
        </Link>
      </Flex>

      {isFetching ? <h1>isFetching</h1> : <h1>is not fetching</h1>}

      <Flex justifyContent="center">
        <Menu autoSelect={false}>
          <MenuButton as={Button}>{year}</MenuButton>
          <MenuList>
            {yearList.reverse().map(yearItem => (
              <MenuItem key={yearItem} onClick={() => router.push(`/anime/${yearItem}/${season}`)}>
                {yearItem}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button}>{season}</MenuButton>
          <MenuList>
            {seasonList.map(seasonItem => (
              <MenuItem key={seasonItem} onClick={() => router.push(`/anime/${year}/${seasonItem}`)}>
                {seasonItem}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <AnimeList
        animes={toShowAnimes}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
      />
    </>
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
