import { GetStaticProps } from 'next'
import { getAnimeById } from '../../services/animeService'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAnimeById(params)

  return {
    props: { resp },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export default function AnimeById({ resp }: { resp: any }) {
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
    studio,
  } = anime
  if (anime)
    return (
      <>
        <p>Title: {title}</p>
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
        <p>studio: {studio || 'n/a'}</p>
      </>
    )
  return <div>no this anime id</div>
}
