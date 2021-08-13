import { Box, Button, Flex } from '@chakra-ui/react'
import { range } from 'ramda'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getAnimesBySeason } from '../../services/dynamodb'
import { useAnimesQuery } from '../../hooks/useAnimesQuery'
import AnimeFilter from '../../components/AnimeFilter'
import AnimeList from '../../components/AnimeList'

// todo remove this duplicate page

type AnimeListProps = {
  resp: any
  params: any
}

export default function AnimeListToday({ resp, params }: AnimeListProps) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useAnimesQuery(resp, params)

  const toShowAnimes = data?.pages.map(({ data }) => data).flat() || []

  return (
    <>
      <Flex flexDir="column" align="center">
        <Link href="/anime" passHref>
          <Button>Back to List</Button>
        </Link>
      </Flex>

      <AnimeFilter params={params} />

      <AnimeList
        animes={toShowAnimes}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params = { year: '2021', season: 'SUMMER' } }) => {
  const resp = await getAnimesBySeason(params)

  return {
    props: { resp, params },
  }
}
