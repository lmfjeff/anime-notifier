import axios from 'axios'
import { nanoid } from 'nanoid'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
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
  const submitCreate = async (anime: any) => {
    await axios.post('/api/anime', { anime })
  }
  return (
    <>
      <AnimeForm anime={{}} submitFn={submitCreate} />
    </>
  )
}
