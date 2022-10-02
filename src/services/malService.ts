import axios from 'axios'

// if response exist in error, return error.response instead of reject
axios.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response) {
      return error.response
    }
    return Promise.reject(error)
  }
)

export async function refreshToken(malAuth: { accessToken: string; refreshToken: string; lastUpdated: string }) {
  const clientId = process.env.MAL_CLIENT_ID
  const clientSecret = process.env.MAL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw Error('Need mal secret to refresh token')

  const url = 'https://myanimelist.net/v1/oauth2/token'
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('refresh_token', malAuth.refreshToken)
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const resp = await axios.post(url, params, config)
  const now = new Date()
  return {
    accessToken: resp.data.access_token,
    refreshToken: resp.data.refresh_token,
    lastUpdated: now.toISOString(),
  }
}

export async function getSeasonalAnime(
  // malAuth: { accessToken: string; refreshToken: string; lastUpdated: string },
  year: string,
  season: string
) {
  console.log('---bot for updating mal anime info into dynamodb---')
  console.log(`start for: ${year} ${season}`)
  if (!process.env.MAL_CLIENT_ID) throw Error('process.env.MAL_CLIENT_ID required')

  const config = {
    headers: {
      // Authorization: `Bearer ${malAuth.accessToken}`,
      'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID,
    },
  }
  const params = {
    offset: '0',
    limit: '500',
    fields:
      'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,genres,media_type,status,start_season,broadcast,source,studios,num_episodes',
    nsfw: '1',
  }
  const url = `https://api.myanimelist.net/v2/anime/season/${year}/${season}?` + new URLSearchParams(params)

  const resp = await axios.get(url, config)
  return resp.data
}

export async function getAnime(
  // malAuth: { accessToken: string; refreshToken: string; lastUpdated: string },
  malId: string
) {
  if (!process.env.MAL_CLIENT_ID) throw Error('process.env.MAL_CLIENT_ID required')
  const config = {
    headers: {
      // Authorization: `Bearer ${malAuth.accessToken}`,
      'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID,
    },
  }
  const params = {
    fields:
      'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,genres,media_type,status,start_season,broadcast,source,studios,num_episodes',
  }
  const url = `https://api.myanimelist.net/v2/anime/${malId}?` + new URLSearchParams(params)
  const response = await axios.get(url, config)
  return response.data
}
