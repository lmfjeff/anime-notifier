import { Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { FollowList, Media, Prisma } from '@prisma/client'
import { FollowFilter } from '../../../components/FollowFilter'
import { BackToTop } from '../../../components/BackToTop'
import { TimeContext } from '../../../context/time'
import { PrefContext } from '../../../context/pref'

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

  let animes: Media[]

  // if visit this season, get this season's anime & past 3 seasons' currently_airing anime
  if (year === now.year().toString() && season === month2Season(nowMonth)) {
    // const animesByStatus = await getAnimesByStatus(year, season)
    // const animesBySeason = await getAnimesBySeason(year, season)
    // animes = [...animesByStatus, ...animesBySeason]
    const animesBySeason = await getAnimesBySeason(year, season)
    animes = animesBySeason
  } else {
    const animesBySeason = await getAnimesBySeason(year, season)
    animes = animesBySeason
  }

  // animes = animes.filter(anime => anime.format === 'TV')
  console.log('🚀 ~ file: [[...path]].tsx:63 ~ constgetStaticProps:GetStaticProps= ~ animes:', animes.length)

  return {
    props: { animes, queryParams, genTime },
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type AnimeSeasonPageProps = {
  animes: Media[]
  queryParams: GetAnimesBySeasonRequest
  genTime: string
}

AnimeSeasonPage.getTitle = '番表'

export default function AnimeSeasonPage({ animes, queryParams, genTime }: AnimeSeasonPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const { year, season } = queryParams
  const title = season ? `${year}年${seasonTcOption[season]}` : ''

  const time = useContext(TimeContext)
  const thisSeason = time ? year === time.year().toString() && season === month2Season(time.month() + 1) : false

  const pref = useContext(PrefContext)
  const { sort, followFilter, handleChangeSort, handleChangeFollowFilter } = pref

  const fetchFollowing = async () => {
    const { data } = await axios.get('/api/following')
    return data
  }
  const {
    data: followingData,
    refetch: followingRefetch,
    isLoading: isFollowingLoading,
  } = useQuery('getFollowing', fetchFollowing, {
    enabled: !loading && !!session,
  })
  const followingAnimes = followingData?.animes

  // todo optimistic update
  const upsertAnimelist = async (data: Partial<FollowList>) => {
    await axios.post('/api/following', data)
    await followingRefetch()
  }

  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { media_id: id } })
    await followingRefetch()
  }

  const onSelectSeason = (val: GetAnimesBySeasonRequest) => {
    const { year, season } = val
    const url = year && season ? `${year}/${season}` : ''
    router.push(`/anime/season/${url}`)
  }

  // filter out anime hidden by admin
  const filterByHide = (el: any) => el.isHiden !== true

  const calcVote = (ani: Prisma.MediaGetPayload<{ include: { followlist: true } }>) => {
    const votedList = ani.followlist.filter(a => a.score !== null)
    if (votedList.length > 0) {
      ani.score = votedList.reduce((prev, curr) => prev + (curr.score || 0), 0) / votedList.length
    }
    return ani
  }

  const tvAnimes: Media[] = useMemo(
    () => animes.filter(filterByHide).map(jp2hk).map(transformAnimeLateNight).sort(sortTime).map(calcVote),
    [animes]
  )
  // console.log("🚀 ~ file: [[...path]].tsx:142 ~ AnimeSeasonPage ~ tvAnimes:", tvAnimes)

  if (!time) return null

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
        isFollowingLoading={isFollowingLoading}
        upsertAnimelist={upsertAnimelist}
        removeFollowing={removeFollowing}
        sort={sort}
        signedIn={!loading && !!session}
        now={time}
        followFilter={followFilter}
        thisSeason={thisSeason}
      />
      <Flex justifyContent="flex-end" mt={4}>
        <Text fontSize="xs" color="gray">
          Update : {genTime}
        </Text>
      </Flex>
    </>
  )
}
