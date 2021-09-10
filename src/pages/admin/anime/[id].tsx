import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { AnimeForm } from '../../../components/AnimeForm'
import { getAnimeById } from '../../../services/animeService'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAnimeById(params)

  return {
    props: { resp },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export default function AnimeEdit({ resp }: { resp: any }) {
  const { anime } = resp
  const {
    id,
    yearSeason,
    title,
    picture,
    alternative_titles,
    startDate,
    endDate,
    summary,
    genres,
    type,
    status,
    dayOfWeek,
    time,
    source,
    studios,
  } = anime

  const submitUpdate = async (anime: any) => {
    const resp = await axios.put('/api/anime', { anime })
  }

  // editable, form control, input, formik, react hook form, react final form
  if (anime)
    return (
      <>
        <div>Edit Anime</div>
        <p>Title: {title}</p>
        <p>Picture: {picture}</p>
        <p>alternative_titles: {alternative_titles.ja}</p>
        <p>startDate: {startDate}</p>
        <p>endDate: {endDate}</p>
        <p>summary: {summary}</p>
        <p>
          genres:{' '}
          {genres.map((genre: any) => (
            <span key={genre}>{genre}, </span>
          ))}
        </p>
        <p>type: {type}</p>
        <p>status: {status}</p>
        <p>dayOfWeek: {dayOfWeek}</p>
        <p>time: {time}</p>
        <p>source: {source}</p>
        <p>
          studios:{' '}
          {studios.map((studio: any) => (
            <span key={studio}>{studio}, </span>
          ))}
        </p>
        <AnimeForm anime={anime} submitFn={submitUpdate} />
      </>
    )
  return <div>no this anime id</div>
}
