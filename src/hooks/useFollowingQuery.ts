import axios from 'axios'
import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'

export function useFollowingQuery(following: string[], enabled: boolean) {
  const queryKey = ['animes', 'following']

  const fetchAnimeList = useCallback(
    async ({ pageParam = 0 }) => {
      const params = {
        anime: following?.slice(pageParam, pageParam + 50),
      }
      const resp = await axios.post('/api/animeList', params)
      const data = resp.data
      return {
        animes: data.animes,
        nextCursor: pageParam + 50,
      }
    },
    [following]
  )

  return useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor < following?.length ? lastPage.nextCursor : undefined
    },
    enabled: enabled,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })
}
