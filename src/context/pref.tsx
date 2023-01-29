import React, { createContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

type PrefContextProps = {
  sort: string
  followFilter: string | null
  handleChangeSort?: (v: string) => void
  handleChangeFollowFilter?: (v: string | null) => void
}

const defaultPref = {
  sort: 'weekly',
  followFilter: null,
}

export const PrefContext = createContext<PrefContextProps>(defaultPref)

export default function PrefProvider({ children }: Props) {
  const [sort, setSort] = useState('weekly')
  const [followFilter, setFollowFilter] = useState<string | null>(null)
  const LOCAL_STORAGE_SORT_KEY = 'animes-sort'
  const LOCAL_STORAGE_FOLLOW_FILTER_KEY = 'animes-follow-filter'

  const handleChangeSort = (v: string) => {
    setSort(v)
    window.localStorage.setItem(LOCAL_STORAGE_SORT_KEY, v)
  }

  const handleChangeFollowFilter = (v: string | null) => {
    setFollowFilter(v)
    window.localStorage.setItem(LOCAL_STORAGE_FOLLOW_FILTER_KEY, v || '')
  }

  useEffect(() => {
    const sortPref = window.localStorage.getItem(LOCAL_STORAGE_SORT_KEY)
    const followFilterPref = window.localStorage.getItem(LOCAL_STORAGE_FOLLOW_FILTER_KEY)
    if (sortPref) setSort(sortPref)
    if (followFilterPref) setFollowFilter(followFilterPref)
  }, [])

  const state = {
    sort,
    followFilter,
    handleChangeSort,
    handleChangeFollowFilter,
  }

  return <PrefContext.Provider value={state}>{children}</PrefContext.Provider>
}
