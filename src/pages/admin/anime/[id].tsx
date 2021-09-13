import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getSession } from 'next-auth/client'
import { AnimeForm } from '../../../components/AnimeForm'
import { getAnimeById } from '../../../services/animeService'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }

  const { params } = context
  const resp = await getAnimeById(params)

  return {
    props: { resp },
  }
}

export default function AnimeEditPage({ resp }: { resp: any }) {
  const { anime } = resp
  const { id } = anime

  const submitUpdate = async (anime: any) => {
    await axios.put('/api/anime', { anime: { ...anime, id } })
  }

  // editable, form control, input, formik, react hook form, react final form
  if (anime)
    return (
      <>
        <div>Edit Anime</div>
        {/*
        <p>alternative_titles: {alternative_titles.ja}</p>
        <p>
          genres:{' '}
          {genres.map((genre: any) => (
            <span key={genre}>{genre}, </span>
          ))}
        </p>
        <p>
          studios:{' '}
          {studios.map((studio: any) => (
            <span key={studio}>{studio}, </span>
          ))}
        </p> */}
        <AnimeForm anime={anime} submitFn={submitUpdate} />
      </>
    )
  return <div>no this anime id</div>
}
