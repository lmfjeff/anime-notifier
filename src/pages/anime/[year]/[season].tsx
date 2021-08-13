import { Button, Flex, Select } from '@chakra-ui/react'
import { getAnimesBySeason } from '../../../services/dynamodb'
import { useAnimesQuery } from '../../../hooks/useAnimesQuery'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AnimeList from '../../../components/AnimeList'
import { GetStaticProps } from 'next'
import AnimeFilter from '../../../components/AnimeFilter'

type AnimeListProps = {
  resp: any
  params: any
}

export default function AnimeListBySeason({ resp, params }: AnimeListProps) {
  const { animes, nextCursor } = resp
  const { year, season } = params
  const router = useRouter()

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAnimesBySeason(params)

  return {
    props: { resp, params },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
