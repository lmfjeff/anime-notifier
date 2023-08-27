import { Media } from '@prisma/client'
import { equals, isEmpty } from 'ramda'
import { AnimeDetail } from '../types/anime'

// todo
export function malAnime2DynamodbAnime(malAnime: any): Media {
  return {} as Media
  //   const {
  //     id,
  //     title,
  //     main_picture,
  //     alternative_titles,
  //     start_date,
  //     end_date,
  //     synopsis,
  //     genres,
  //     media_type,
  //     status,
  //     start_season,
  //     broadcast,
  //     source,
  //     studios,
  //     num_episodes,
  //     mean,
  //   } = malAnime
  //   const year = start_season?.year
  //   const season = start_season?.season === 'fall' ? 'autumn' : start_season?.season
  //   const yearSeason = year && season ? `${year}-${season}` : null
  //   const dynamodbAnime = {
  //     yearSeason,
  //     title,
  //     picture: main_picture?.large || null,
  //     type: media_type,
  //     status,
  //     dayOfWeek: broadcast?.day_of_the_week || null,
  //     time: broadcast?.start_time || null,
  //     alternative_titles: alternative_titles || null,
  //     startDate: start_date || null,
  //     endDate: end_date || null,
  //     summary: synopsis || null,
  //     genres: genres?.map(({ name }: { name: any }) => name) || [],
  //     source: source || null,
  //     studios: studios?.map(({ name }: { name: any }) => name) || [],
  //     numEpisodes: num_episodes,
  //     malId: id.toString(),
  //     mal_score: mean || null,
  //   } as Media
  //   return dynamodbAnime
  // }

  // export function newAnimeFromMal(oldAnime: Media, newAnime: Media) {
  //   const propsToUpdate: (keyof Media)[] = [
  //     'yearSeason',
  //     'picture',
  //     'type',
  //     'status',
  //     'dayOfWeek',
  //     'time',
  //     'alternative_titles',
  //     'startDate',
  //     'endDate',
  //     'genres',
  //     'source',
  //     'studios',
  //     'numEpisodes',
  //     'mal_score',
  //   ]
  //   const modifiedItem: any = {}
  //   // if the picture is relative path img/nanoid.webp, not update
  //   const regex = new RegExp(/^img\/[A-Za-z0-9_-]*\.(jpg|jpeg|png|webp|avif)/, 'g')
  //   for (const prop of propsToUpdate) {
  //     if (!equals(oldAnime[prop], newAnime[prop])) {
  //       if (prop === 'picture' && regex.test(oldAnime[prop] || '')) continue

  //       modifiedItem[prop] = newAnime[prop]
  //     }
  //   }
  //   if (isEmpty(modifiedItem)) return null
  //   return {
  //     id: oldAnime.id,
  //     ...modifiedItem,
  //   }
}

// todo
export function newAnimeFromAcg(oldAnime: Media, newAnime: Media) {
  const propsToUpdate: (keyof Media)[] = ['title', 'summary']
  const modifiedItem: any = {}
  for (const prop of propsToUpdate) {
    if (!equals(oldAnime[prop], newAnime[prop]) && newAnime[prop]) {
      modifiedItem[prop] = newAnime[prop]
    }
  }
  if (isEmpty(modifiedItem)) return null
  return {
    id: oldAnime.id,
    ...modifiedItem,
  }
}
