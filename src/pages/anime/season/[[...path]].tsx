import { Button, Flex } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { AnimeList } from '../../../components/AnimeList'
import { getAllAnimesBySeason } from '../../../services/animeService'
import { month2Season } from '../../../utils/date'
import { AnimeSorter } from '../../../components/AnimeSorter'
import { SeasonPicker } from '../../../components/SeasonPicker'
import { useSession } from 'next-auth/client'
import { HtmlHead } from '../../../components/HtmlHead'
import { seasonTcOption } from '../../../constants/animeOption'

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

type Props = {
  resp: any
  queryParams: any
}

AnimeSeasonIndex.getTitle = '番表'

export default function AnimeSeasonIndex({ resp, queryParams }: Props) {
  const { animes } = resp
  const router = useRouter()
  const [session, loading] = useSession()
  const [sort, setSort] = useState('weekly')
  const { year, season } = queryParams
  const title = `${year}年${seasonTcOption[season] || ''}`

  const fetchFollowing = async () => {
    const resp = await axios.get('/api/following')
    const data = await resp.data
    return data
  }
  const getFollowingQuery = useQuery('getFollowing', fetchFollowing, { enabled: !loading && !!session })
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

  return (
    <>
      <HtmlHead title={title} />
      <Flex justifyContent="center" alignItems="center" wrap="wrap">
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
        <AnimeSorter sort={sort} setSort={setSort} />
      </Flex>

      <AnimeList
        animes={animes}
        followingAnimes={followingAnimes}
        addFollowing={addFollowing}
        removeFollowing={removeFollowing}
        sort={sort}
        signedIn={!loading && !!session}
      />
    </>
  )
}
