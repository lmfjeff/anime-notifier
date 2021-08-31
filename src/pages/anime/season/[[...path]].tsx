import { Flex } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import SeasonPicker from '../../../components/SeasonPicker'
import AnimeList from '../../../components/AnimeList'
import { useAnimesQuery } from '../../../hooks/useAnimesQuery'
import { getAllAnimesBySeason } from '../../../services/animeService'
import { month2Season } from '../../../utils/date'
import AnimeSorter from '../../../components/AnimeSorter'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { path } = params as {
    path?: any[]
  }

  const now = new Date()
  const nowMonth = now.getMonth()

  const year = nth(0, path || []) || now.getFullYear().toString()
  const season = nth(1, path || []) || month2Season(nowMonth)

  const queryParams = {
    year,
    season,
  }

  const resp = await getAllAnimesBySeason(queryParams)

  return {
    props: { resp, queryParams },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type AnimeListProps = {
  resp: any
  queryParams: any
}

const AnimeSeasonIndex = ({ resp, queryParams }: AnimeListProps) => {
  const { animes, nextCursor } = resp
  const router = useRouter()
  const [sort, setSort] = useState('weekly')

  const { data, fetchNextPage, hasNextPage, isFetching } = useAnimesQuery(resp, queryParams)

  const fetchFollowing = async () => {
    const resp = await axios.get('/api/following')
    const data = await resp.data
    return data
  }
  const getFollowingQuery = useQuery('getFollowing', fetchFollowing)
  const followingAnimes = getFollowingQuery.data?.anime || null

  const onSelectSeason = (val: { year: string; season: string }) => {
    router.push(`/anime/season/${val.year}/${val.season}`)
  }

  const addFollowing = async (id: string) => {
    await axios.post('/api/following', {
      anime: id,
    })
    await getFollowingQuery.refetch()
  }

  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { anime: id } })
    await getFollowingQuery.refetch()
  }

  const toShowAnimes = data?.pages.map(({ data }) => data).flat() || []

  return (
    <>
      {/* <Flex flexDir="column" align="center">
        <div>List of Animes</div>
      </Flex> */}

      <Flex justifyContent="center" alignItems="center" wrap="wrap">
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
        <AnimeSorter sort={sort} setSort={setSort} />
      </Flex>

      <AnimeList
        animes={toShowAnimes}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        followingAnimes={followingAnimes}
        addFollowing={addFollowing}
        removeFollowing={removeFollowing}
        sort={sort}
      />
    </>
  )
}

export default AnimeSeasonIndex
