import { Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { AnimeList } from '../../../components/AnimeList'
import { getAnimesBySeason, getAnimesByStatus } from '../../../services/dynamodb/animeService'
import {
  gethkNow,
  jp2hk,
  month2Season,
  sortTime,
  transformAnimeLateNight,
  formatTimeDetailed,
} from '../../../utils/date'
import { AnimeSorter } from '../../../components/AnimeSorter'
import { SeasonPicker } from '../../../components/SeasonPicker'
import { useSession } from 'next-auth/react'
import { HtmlHead } from '../../../components/HtmlHead'
import { seasonTcOption } from '../../../constants/animeOption'
import { AnimeOverview } from '../../../types/anime'
import { GetAnimesBySeasonRequest } from '../../../types/api'
import { Dayjs } from 'dayjs'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { path } = params as {
    path?: [year: string | undefined, season: string | undefined]
  }

  const now = gethkNow()
  const genTime = formatTimeDetailed(now)
  const nowMonth = now.month() + 1

  const year = nth(0, path || []) || now.year().toString()
  const season = nth(1, path || []) || month2Season(nowMonth)

  const queryParams = {
    year,
    season,
  }

  let animes: AnimeOverview[]

  // if visit this season, get this season's anime & past 3 seasons' currently_airing anime
  if (year === now.year().toString() && season === month2Season(nowMonth)) {
    const { animes: animesByStatus } = await getAnimesByStatus(queryParams)
    const { animes: animesBySeason } = await getAnimesBySeason(queryParams)
    animes = [...animesByStatus, ...animesBySeason]
  } else {
    const { animes: animesBySeason } = await getAnimesBySeason(queryParams)
    animes = animesBySeason
  }

  animes = animes.filter(anime => anime.type === 'tv')

  return {
    props: { animes, queryParams, genTime },
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type AnimeSeasonPageProps = {
  animes: AnimeOverview[]
  queryParams: GetAnimesBySeasonRequest
  genTime: string
}

AnimeSeasonPage.getTitle = '番表'

export default function AnimeSeasonPage({ animes, queryParams, genTime }: AnimeSeasonPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [sort, setSort] = useState('weekly')
  const { year, season } = queryParams
  const title = season ? `${year}年${seasonTcOption[season]}` : ''
  const [now, setNow] = useState<Dayjs>()
  useEffect(() => {
    setNow(gethkNow())
  }, [])

  const fetchFollowing = async () => {
    const { data } = await axios.get('/api/following')
    return data
  }
  const { data: followingData, refetch: followingRefetch } = useQuery('getFollowing', fetchFollowing, {
    enabled: !loading && !!session,
  })
  const followingAnimeIds = followingData?.animeIds

  // todo optimistic update
  const addFollowing = async (id: string) => {
    await axios.post('/api/following', {
      animeId: id,
    })
    await followingRefetch()
  }

  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { animeId: id } })
    await followingRefetch()
  }

  const onSelectSeason = (val: GetAnimesBySeasonRequest) => {
    const { year, season } = val
    const url = year && season ? `${year}/${season}` : ''
    router.push(`/anime/season/${url}`)
  }

  // filter out anime hidden by admin
  const filterByHide = (el: any) => el.hide !== true

  const tvAnimes: AnimeOverview[] = useMemo(
    () => animes.filter(filterByHide).map(jp2hk).map(transformAnimeLateNight).sort(sortTime),
    [animes]
  )

  return (
    <>
      <HtmlHead title={title} />
      <Flex justifyContent="center" alignItems="center" wrap="wrap" gap={2}>
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
        <AnimeSorter sort={sort} setSort={setSort} />
      </Flex>

      <AnimeList
        animes={tvAnimes}
        followingAnimeIds={followingAnimeIds}
        addFollowing={addFollowing}
        removeFollowing={removeFollowing}
        sort={sort}
        signedIn={!loading && !!session}
        now={now}
      />
      <Flex justifyContent="flex-end">
        <Text fontSize="xs" color="gray">
          Update : {genTime}
        </Text>
      </Flex>
    </>
  )
}
