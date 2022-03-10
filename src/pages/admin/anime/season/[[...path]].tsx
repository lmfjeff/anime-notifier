import { Flex } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import { useMemo } from 'react'
import { AdminAnimeList } from '../../../../components/AdminAnimeList'
import { SeasonPicker } from '../../../../components/SeasonPicker'
import { getAnimesBySeason, getAnimesByStatus } from '../../../../services/animeService'
import { AnimeOverview } from '../../../../types/anime'
import { GetAnimesBySeasonRequest } from '../../../../types/api'
import { jp2hk, month2Season, sortTime, transformAnimeLateNight } from '../../../../utils/date'

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

  const now = new Date()
  const nowMonth = now.getMonth() + 1

  const year = nth(0, path || []) || now.getFullYear().toString()
  const season = nth(1, path || []) || month2Season(nowMonth)

  const queryParams = {
    year,
    season,
  }

  let animes: AnimeOverview[]

  // if visit this season, get this season's anime & past 3 seasons' currently_airing anime
  if (year === now.getFullYear().toString() && season === month2Season(nowMonth)) {
    const { animes: animesByStatus } = await getAnimesByStatus(queryParams)
    const { animes: animesBySeason } = await getAnimesBySeason(queryParams)
    animes = [...animesByStatus, ...animesBySeason]
  } else {
    const { animes: animesBySeason } = await getAnimesBySeason(queryParams)
    animes = animesBySeason
  }

  return {
    props: { animes, queryParams },
  }
}

type AdminAnimeSeasonPageProps = {
  animes: AnimeOverview[]
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

  const onSelectSeason = (val: GetAnimesBySeasonRequest) => {
    const { year, season } = val
    const url = year && season ? `${year}/${season}` : ''
    router.push(`/admin/anime/season/${url}`)
  }

  const tvAnimes: AnimeOverview[] = useMemo(
    () => animes.map(jp2hk).map(transformAnimeLateNight).sort(sortTime),
    [animes]
  )

  return (
    <>
      <Flex justifyContent="center" alignItems="center" wrap="wrap" gap={2}>
        <Link href="/admin/anime/create" passHref>
          <Button bg={'white'}>新增動畫</Button>
        </Link>
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
      </Flex>
      <AdminAnimeList animes={tvAnimes} deleteAnime={deleteAnime} />
    </>
  )
}
