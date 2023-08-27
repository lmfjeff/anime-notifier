// // import { createAnime, getAnimeByMalId, updateAnime } from '../services/dynamodb/animeService'
// import { createAnime, getAnimeByMalId, updateAnime } from '../services/prisma/anime.service'
// import { Prisma } from '@prisma/client'
// import { getSeasonalAnime } from '../services/malService'
// import { getYearSeason, nextSeason } from '../utils/date'
// import { malAnime2DynamodbAnime, newAnimeFromMal } from '../utils/malUtils'

// if (typeof require !== 'undefined' && require.main === module) {
//   handler()
// }

// export async function handler(defaultyear?: string, defaultseason?: string) {
//   // let malAuth
//   // if (isDev) {
//   //   if (!process.env.MAL_AUTH) throw Error("no mal auth for testing")
//   //   malAuth = JSON.parse(process.env.MAL_AUTH)
//   // } else {
//   //   // todo validate malauth after get auth & before put auth
//   //   const oldMalAuth = await getMalAuth()

//   //   malAuth = await refreshToken(oldMalAuth)
//   //   if (!malAuth.accessToken || !malAuth.refreshToken) {
//   //     throw Error('refresh token error')
//   //   }

//   //   await putMalAuth(malAuth)
//   // }

//   let { year, season } = getYearSeason()
//   if (process.env.MAL_FETCH_NEXT_SEASON === 'true') {
//     const nextSeasonYear = nextSeason({ year, season }).year
//     const nextSeasonSeason = nextSeason({ year, season }).season
//     if (!nextSeasonYear || !nextSeasonSeason) throw Error('next season value undefined')
//     year = nextSeasonYear
//     season = nextSeasonSeason
//   }
//   if (defaultyear) year = defaultyear
//   if (defaultseason) season = defaultseason

//   if (season === 'autumn') season = 'fall'

//   // get seasonal anime list from mal api
//   const data = await getSeasonalAnime(year, season)
//   if (!data.data) {
//     console.log('error, mal responds with no data')
//     if (data.error) console.log(data.error)
//     throw Error('error, mal responds with no data')
//   }

//   console.log('anime count: ', data.data.length)
//   for (const item of data.data) {
//     const newAnime = malAnime2DynamodbAnime(item.node)
//     // filter out ova/ona/sp/movie
//     // if (newAnime.type !== "tv") continue

//     const anime = await getAnimeByMalId(newAnime.malId as string)
//     // if anime not exist in db, create one
//     if (!anime) {
//       await createAnime(newAnime as Prisma.AnimeCreateInput)
//       console.log('New anime added: ', newAnime.title)
//     } else {
//       // if exist, compare mal anime with db anime, update if updated
//       const modifiedAnime = newAnimeFromMal(anime, newAnime)
//       if (!modifiedAnime) continue
//       await updateAnime(modifiedAnime)
//       console.log('Anime updated: ', anime.title)
//       // console.log('old: ', anime)
//       // console.log('new: ', newAnime)
//       // console.log('Changed: ', modifiedAnime)
//     }
//   }
//   console.log('finish import')
// }

// todo update bot
export const a = 1
