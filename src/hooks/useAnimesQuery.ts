import axios from 'axios'
import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'

export function useAnimesQuery(resp: any, queryParams: any) {
  const { year, season } = queryParams
  const queryKey = ['animes', year, season]

  const fetchAnimeList = useCallback(
    async ({ pageParam }) => {
      const params = {
        year,
        season,
        ...(pageParam ? { nextCursor: JSON.stringify(pageParam) } : {}),
      }
      const resp = await axios.get('/api/anime', { params })
      const data = resp.data
      return {
        data: data.animes,
        nextCursor: data.nextCursor,
      }
    },
    [year, season]
  )

  return useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    // enabled: false,
    initialData: { pages: [{ data: resp.animes, nextCursor: resp.nextCursor }], pageParams: [undefined] },
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })
}
