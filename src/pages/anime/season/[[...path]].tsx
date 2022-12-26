import { Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { AnimeList } from '../../../components/AnimeList'
// import { getAnimesBySeason, getAnimesByStatus } from '../../../services/dynamodb/animeService'
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
import { getAnimesBySeason, getAnimesByStatus } from '../../../services/prisma/anime.service'
import { Anime, Animelist, Prisma } from '@prisma/client'
import { FollowFilter } from '../../../components/FollowFilter'
import { BackToTop } from '../../../components/BackToTop'

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

  let animes: Anime[]

  // if visit this season, get this season's anime & past 3 seasons' currently_airing anime
  if (year === now.year().toString() && season === month2Season(nowMonth)) {
    const animesByStatus = await getAnimesByStatus(year, season)
    const animesBySeason = await getAnimesBySeason(year, season)
    animes = [...animesByStatus, ...animesBySeason]
  } else {
    const animesBySeason = await getAnimesBySeason(year, season)
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
  animes: Anime[]
  queryParams: GetAnimesBySeasonRequest
  genTime: string
}

AnimeSeasonPage.getTitle = '番表'

export default function AnimeSeasonPage({ animes, queryParams, genTime }: AnimeSeasonPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [sort, setSort] = useState('weekly')
  const [followFilter, setFollowFilter] = useState<string | null>(null)
  const { year, season } = queryParams
  const title = season ? `${year}年${seasonTcOption[season]}` : ''
  const [now, setNow] = useState<Dayjs>()
  useEffect(() => {
    setNow(gethkNow())
    const sortPref = window.localStorage.getItem('animes-sort')
    const followFilterPref = window.localStorage.getItem('animes-follow-filter')
    if (sortPref) setSort(sortPref)
    if (followFilterPref) setFollowFilter(followFilterPref)
  }, [])

  const handleChangeSort = (v: string) => {
    setSort(v)
    window.localStorage.setItem('animes-sort', v)
  }

  const handleChangeFollowFilter = (v: string | null) => {
    setFollowFilter(v)
    window.localStorage.setItem('animes-follow-filter', v || '')
  }

  const fetchFollowing = async () => {
    const { data } = await axios.get('/api/following')
    return data
  }
  const { data: followingData, refetch: followingRefetch } = useQuery('getFollowing', fetchFollowing, {
    enabled: !loading && !!session,
  })
  const followingAnimes = followingData?.animes

  // todo optimistic update
  const upsertAnimelist = async (animelist: Partial<Animelist>) => {
    await axios.post('/api/following', animelist)
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

  const calcVote = (ani: Prisma.AnimeGetPayload<{ include: { animelist: true } }>) => {
    const votedList = ani.animelist.filter(a => a.score !== null)
    if (votedList.length > 0) {
      ani.average_vote_score = votedList.reduce((prev, curr) => prev + (curr.score || 0), 0) / votedList.length
    }
    return ani
  }

  const tvAnimes: Anime[] = useMemo(
    () => animes.filter(filterByHide).map(jp2hk).map(transformAnimeLateNight).sort(sortTime).map(calcVote),
    [animes]
  )

  return (
    <>
      <HtmlHead title={title} />
      <BackToTop />
      <Flex justifyContent="center" alignItems="center" gap={2}>
        <SeasonPicker key={JSON.stringify(queryParams)} queryParams={queryParams} onSelectSeason={onSelectSeason} />
        <AnimeSorter key={sort} sort={sort} setSort={handleChangeSort} />
        <FollowFilter key={followFilter} followFilter={followFilter} setFollowFilter={handleChangeFollowFilter} />
      </Flex>

      <AnimeList
        animes={tvAnimes}
        followingAnimes={followingAnimes}
        upsertAnimelist={upsertAnimelist}
        removeFollowing={removeFollowing}
        sort={sort}
        signedIn={!loading && !!session}
        now={now}
        followFilter={followFilter}
      />
      <Flex justifyContent="flex-end" mt={4}>
        <Text fontSize="xs" color="gray">
          Update : {genTime}
        </Text>
      </Flex>
    </>
  )
}
