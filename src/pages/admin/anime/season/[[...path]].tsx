import { Flex } from '@chakra-ui/layout'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { nth } from 'ramda'
import { AdminAnimeList } from '../../../../components/AdminAnimeList'
import { SeasonPicker } from '../../../../components/SeasonPicker'
import { getAllAnimesBySeason } from '../../../../services/animeService'
import { month2Season } from '../../../../utils/date'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }

  const { params } = context
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

type Props = {
  resp: any
  queryParams: any
}

AdminAnimeSeasonPage.getTitle = '管理動畫'

export default function AdminAnimeSeasonPage({ resp, queryParams }: Props) {
  const { animes } = resp
  const router = useRouter()
  const onSelectSeason = (val: { year: string; season: string }) => {
    router.push(`/admin/anime/season/${val.year}/${val.season}`)
  }
  const deleteAnime = async (id: string) => {
    await axios.delete('/api/anime', { params: { id } })
    window.location.reload()
  }
  return (
    <>
      <Flex justifyContent="center" alignItems="center" wrap="wrap">
        <SeasonPicker queryParams={queryParams} onSelectSeason={onSelectSeason} />
      </Flex>
      <AdminAnimeList animes={animes} deleteAnime={deleteAnime} />
    </>
  )
}
