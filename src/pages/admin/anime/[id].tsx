import { Box, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AnimeForm } from '../../../components/AnimeForm'
import { getAnimeById } from '../../../services/dynamodb/animeService'
import { AnimeDetail } from '../../../types/anime'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }

  const { id } = context.params as { id: string | undefined }
  const anime = await getAnimeById(id)

  if (!anime)
    return {
      notFound: true,
    }

  return {
    props: { anime },
  }
}

type AnimeEditPageProps = {
  anime: AnimeDetail
}

export default function AnimeEditPage({ anime }: AnimeEditPageProps) {
  const router = useRouter()
  const submitUpdate = async (anime: any) => {
    await axios.put('/api/animeEdit', { anime })
    router.reload()
  }

  return (
    <Flex flexDir={'column'} gap={3} alignItems={'center'}>
      <Text>Edit Anime</Text>
      <AnimeForm anime={anime} submitFn={submitUpdate} />
    </Flex>
  )
}
