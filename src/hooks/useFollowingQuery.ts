import axios from 'axios'
import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'
import { FollowingListResponse } from '../types/api'

export function useFollowingQuery(enabled: boolean) {
  const queryKey = ['animes', 'following']

  const fetchAnimeList = useCallback(async ({ pageParam = 0 }) => {
    const params = {
      page: pageParam,
    }
    const { data } = (await axios.get('/api/followingList', { params })) as { data: FollowingListResponse }
    return {
      animes: data.animes,
      total: data.total,
      nextCursor: pageParam + 50,
    }
  }, [])

  return useInfiniteQuery(queryKey, fetchAnimeList, {
    getNextPageParam: lastPage => {
      return lastPage.nextCursor < lastPage.total ? lastPage.nextCursor : undefined
    },
    enabled,
  })
}
