import { Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { AnimeForm } from '../../../components/AnimeForm'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }

  return {
    props: {},
  }
}

export default function AnimeCreatePage() {
  const router = useRouter()
  const submitCreate = async (anime: any) => {
    await axios.post('/api/animeEdit', { anime })
    router.push('/admin/anime/season')
  }
  return (
    <Flex flexDir={'column'} gap={3} alignItems={'center'}>
      <Text>Create Anime</Text>
      <AnimeForm anime={{}} submitFn={submitCreate} />
    </Flex>
  )
}
