import axios from 'axios'
import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'
import { FollowingListResponse } from '../types/api'

export function useFollowingQuery(enabled: boolean, sort: string, order: string, status: string) {
  const queryKey = ['animes', 'following', sort, order, status]

  const fetchAnimeList = useCallback(
    async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        sort,
        order,
        status,
      }
      const { data } = await axios.get('/api/following', { params })
      return {
        animes: data.animes,
        total: data.total,
        page_size: data.page_size,
        page: pageParam,
      }
    },
    [sort, order, status]
  )

  return useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: lastPage => {
      // return lastPage.nextCursor < lastPage.total ? lastPage.nextCursor : undefined
      return lastPage.page * lastPage.page_size < lastPage.total ? lastPage.page + 1 : undefined
    },
    enabled,
  })
}
