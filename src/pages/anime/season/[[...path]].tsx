import { Flex } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React from 'react'
import { useQuery } from 'react-query'
import AnimeFilter from '../../../components/AnimeFilter'
import AnimeList from '../../../components/AnimeList'
import { useAnimesQuery } from '../../../hooks/useAnimesQuery'
import { getAllAnimesBySeason } from '../../../services/animeService'
import { month2Season } from '../../../utils/date'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { path } = params as {
    path?: any[]
  }

  const now = new Date()
  const nowMonth = now.getMonth()

  const year = nth(0, path || []) || now.getFullYear().toString()
  const season = nth(1, path || []) || month2Season(nowMonth)

  const resp = await getAllAnimesBySeason({ year, season })

  return {
    props: { resp, params },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type AnimeListProps = {
  resp: any
  params: any
}

const AnimeSeasonIndex = ({ resp, params }: AnimeListProps) => {
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

export default AnimeSeasonIndex
