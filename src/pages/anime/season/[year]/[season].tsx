import { Button, Flex, Text } from '@chakra-ui/react'
import { useAnimesQuery } from '../../../../hooks/useAnimesQuery'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AnimeList from '../../../../components/AnimeList'
import { GetStaticProps } from 'next'
import AnimeFilter from '../../../../components/AnimeFilter'
import { useQuery } from 'react-query'
import { getAllAnimesBySeason } from '../../../../services/animeService'
import axios from 'axios'

type AnimeListProps = {
  resp: any
  params: any
}

export default function AnimeListBySeason({ resp, params }: AnimeListProps) {
  const { animes, nextCursor } = resp
  const { year, season } = params
  const router = useRouter()

  const { data, fetchNextPage, hasNextPage, isFetching } = useAnimesQuery(resp, params)

  const fetchFollowing = async () => {
    const resp = await axios.get('/api/following')
    const data = await resp.data
    return data
  }
  const getFollowingQuery = useQuery('getFollowing', fetchFollowing)
  const followingAnimes = getFollowingQuery.data?.anime || null

  const addFollowing = async (id: string) => {
    await axios.post('/api/following', {
      anime: id,
    })
    await getFollowingQuery.refetch()
  }

  const removeFollowing = async (id: string) => {
    // await fetch(`/api/removeFollowing?anime=${id}`)
    await axios.delete('/api/following', { params: { anime: id } })
    await getFollowingQuery.refetch()
  }

  const toShowAnimes = data?.pages.map(({ data }) => data).flat() || []

  return (
    <>
      <Flex flexDir="column" align="center">
        <div>List of Animes</div>
      </Flex>

      <AnimeFilter params={params} />

      <AnimeList
        animes={toShowAnimes}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        followingAnimes={followingAnimes}
        addFollowing={addFollowing}
        removeFollowing={removeFollowing}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAllAnimesBySeason(params)

  return {
    props: { resp, params },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
