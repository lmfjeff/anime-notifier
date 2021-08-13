import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'

export function useAnimesQuery(resp: any, params: any) {
  const { year, season } = params
  const queryKey = ['animes', year, season]

  // todo change fetch to axios
  const fetchAnimeList = useCallback(
    async ({ pageParam }) => {
      const resp = await fetch(
        `/api/anime?year=${year}&season=${season}&nextCursor=${pageParam ? JSON.stringify(pageParam) : ''}`
      )
      const data = await resp.json()
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
