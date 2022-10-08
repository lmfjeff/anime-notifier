import { createAnime, getAnimeByMalId, updateAnime } from '../services/dynamodb/animeService'
import { getSeasonalAnime } from '../services/malService'
import { getYearSeason } from '../utils/date'
import { malAnime2DynamodbAnime, newAnimeFromMal } from '../utils/malUtils'

if (typeof require !== 'undefined' && require.main === module) {
  handler()
}

export async function handler() {
  // let malAuth
  // if (isDev) {
  //   if (!process.env.MAL_AUTH) throw Error("no mal auth for testing")
  //   malAuth = JSON.parse(process.env.MAL_AUTH)
  // } else {
  //   // todo validate malauth after get auth & before put auth
  //   const oldMalAuth = await getMalAuth()

  //   malAuth = await refreshToken(oldMalAuth)
  //   if (!malAuth.accessToken || !malAuth.refreshToken) {
  //     throw Error('refresh token error')
  //   }

  //   await putMalAuth(malAuth)
  // }

  let { year, season } = getYearSeason()
  if (season === 'autumn') season = 'fall'

  // get seasonal anime list from mal api
  const data = await getSeasonalAnime(year, season)
  if (!data.data) {
    console.log('error, mal responds with no data')
    if (data.error) console.log(data.error)
    return
  }

  console.log('anime count: ', data.data.length)
  for (const item of data.data) {
    const newAnime = malAnime2DynamodbAnime(item.node)
    // filter out ova/ona/sp/movie
    // if (newAnime.type !== "tv") continue

    const { anime } = await getAnimeByMalId({ malId: newAnime.malId })
    // if anime not exist in db, create one
    if (!anime) {
      await createAnime({ anime: newAnime })
      console.log('New anime added: ', newAnime.title)
    } else {
      // if exist, compare mal anime with db anime, update if updated
      const modifiedAnime = newAnimeFromMal(anime, newAnime)
      if (!modifiedAnime) continue
      await updateAnime({ anime: modifiedAnime })
      console.log('Anime updated: ', anime.title)
      console.log('old: ', anime)
      console.log('new: ', newAnime)
      console.log('Changed: ', modifiedAnime)
    }
  }
  console.log('finish import')
}