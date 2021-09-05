import axios from 'axios'
import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'

export function useFollowingQuery(enabled: boolean) {
  const queryKey = ['animes', 'following']

  const fetchAnimeList = useCallback(async ({ pageParam = 0 }) => {
    const params = {
      page: pageParam,
    }
    const resp = await axios.get('/api/animeList', { params })
    const data = resp.data
    return {
      animes: data.animes,
      total: data.total,
      nextCursor: pageParam + 50,
    }
  }, [])

  return useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor < lastPage.total ? lastPage.nextCursor : undefined
    },
    enabled: enabled,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })
}
