import { Flex } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import { Media } from '@prisma/client'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Link } from '../../../../components/CustomLink'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import { useMemo } from 'react'
import { AdminAnimeList } from '../../../../components/AdminAnimeList'
import { SeasonPicker } from '../../../../components/SeasonPicker'
import { getAnimesBySeason, getAnimesByStatus } from '../../../../services/prisma/anime.service'
// import { getAnimesBySeason, getAnimesByStatus } from '../../../../services/dynamodb/animeService'
import { AnimeOverview } from '../../../../types/anime'
import { GetAnimesBySeasonRequest } from '../../../../types/api'
import { gethkNow, jp2hk, month2Season, sortTime, transformAnimeLateNight } from '../../../../utils/date'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }

  const { path } = context.params as {
    path?: [year: string | undefined, season: string | undefined]
  }

  const now = gethkNow()
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
    const animesByStatus = await getAnimesByStatus(year, season)
    const animesBySeason = await getAnimesBySeason(year, season)
    animes = [...animesByStatus, ...animesBySeason]
  } else {
    const animesBySeason = await getAnimesBySeason(year, season)
    animes = animesBySeason
  }

  animes = animes.filter(anime => anime.format === 'TV')

  return {
    props: { animes, queryParams },
  }
}

type AdminAnimeSeasonPageProps = {
  animes: Media[]
  queryParams: GetAnimesBySeasonRequest
}

AdminAnimeSeasonPage.getTitle = '管理動畫'

export default function AdminAnimeSeasonPage({ animes, queryParams }: AdminAnimeSeasonPageProps) {
  const router = useRouter()

  // todo optimistic update
  const deleteAnime = async (id: string) => {
    await axios.delete('/api/animeEdit', { params: { id } })
    router.reload()
  }

  const hideAnime = async (id: string, hide: boolean) => {
    await axios.put('/api/animeEdit', { anime: { id, hide } })
    router.reload()
  }

  const onSelectSeason = (val: GetAnimesBySeasonRequest) => {
    const { year, season } = val
    const url = year && season ? `${year}/${season}` : ''
    router.push(`/admin/anime/season/${url}`)
  }

  const tvAnimes: Media[] = useMemo(() => animes.map(jp2hk).map(transformAnimeLateNight).sort(sortTime), [animes])

  return (
    <>
      <Flex justifyContent="center" alignItems="center" wrap="wrap" gap={2}>
        <Link href="/admin/anime/create">
          <Button bg={'white'}>新增動畫</Button>
        </Link>
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
      </Flex>
      <AdminAnimeList animes={tvAnimes} deleteAnime={deleteAnime} hideAnime={hideAnime} />
    </>
  )
}
