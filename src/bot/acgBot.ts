// import { Anime } from '@prisma/client'
// import axios from 'axios'
import * as cheerio from 'cheerio'
// // import { getAnimeByMalId, updateAnime } from "../services/dynamodb/animeService"
// import { getAnimeByMalId, updateAnime } from '../services/prisma/anime.service'
// import { AnimeDetail } from '../types/anime'
// import { getYearMonth } from '../utils/date'
// import { newAnimeFromAcg } from '../utils/malUtils'

// if (typeof require !== 'undefined' && require.main === module) {
//   handler()
// }

// export async function handler() {
//   const acgBaseUrl = 'https://acgsecrets.hk/bangumi'
//   const fetchNextSeason = process.env.MAL_FETCH_NEXT_SEASON === 'true'
//   const season = getYearMonth(fetchNextSeason)

//   const acgUrl = `${acgBaseUrl}/${season}`
//   const { data } = await axios.get(acgUrl)

//   const animeList = extractAnimeListFromAcgHtml(data) as Anime[]

//   console.log('anime count: ', animeList.length)

//   for (const newAnime of animeList) {
//     const { title, summary, malId } = newAnime
//     if (malId) {
//       const anime = await getAnimeByMalId(malId)
//       if (anime) {
//         const modifiedAnime = newAnimeFromAcg(anime, newAnime)
//         if (!modifiedAnime) continue
//         await updateAnime(modifiedAnime)
//         console.log('Anime updated: ', anime.title)
//         console.log('old: ', anime)
//         console.log('new: ', newAnime)
//         console.log('Changed: ', modifiedAnime)
//       }
//     }
//   }
// }

function extractAnimeListFromAcgHtml(data: any) {
  const $ = cheerio.load(data)
  const animeList = $('[acgs-bangumi-anime-id]')
    .map((index, el) => {
      const title = $(el).find('.entity_localized_name').first().text()
      const summary = $(el).find('.anime_story').text()

      const malId = $(el)
        .find('.anime_links')
        .children()
        .filter((index, el) => {
          const link = $(el).attr('href')
          return !!link?.includes('myanimelist')
        })
        .first()
        .attr('href')
        ?.match(/\d+/)?.[0]

      return {
        title,
        summary,
        malId,
      }
    })
    .toArray()
  return animeList
}

// todo update bot
export const a = 1
