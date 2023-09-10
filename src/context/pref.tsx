import React, { createContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

type PrefContextProps = {
  sort: string
  followFilter: string | null
  followSort: string
  followOrder: string
  followStatus: string
  handleChangeSort?: (v: string) => void
  handleChangeFollowFilter?: (v: string | null) => void
  handleChangeFollowSort?: (v: string) => void
  handleChangeFollowOrder?: (v: string) => void
  handleChangeFollowStatus?: (v: string) => void
}

const defaultPref = {
  sort: 'weekly',
  followFilter: null,
  followSort: 'updatedAt',
  followOrder: 'desc',
  followStatus: 'watching',
}

export const PrefContext = createContext<PrefContextProps>(defaultPref)

export default function PrefProvider({ children }: Props) {
  const [pref, setPref] = useState<PrefContextProps>(defaultPref)
  const LOCAL_STORAGE_KEY = 'animeland-pref'

  const handleSave = (newPref: PrefContextProps) => {
    setPref(newPref)
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPref))
  }

  const handleChangeSort = (v: string) => {
    const newPref = { ...pref, sort: v }
    handleSave(newPref)
  }
  const handleChangeFollowFilter = (v: string | null) => {
    const newPref = { ...pref, followFilter: v }
    handleSave(newPref)
  }
  const handleChangeFollowSort = (v: string) => {
    const newPref = { ...pref, followSort: v, followOrder: 'desc' }
    handleSave(newPref)
  }
  const handleChangeFollowOrder = (v: string) => {
    const newPref = { ...pref, followOrder: v }
    handleSave(newPref)
  }
  const handleChangeFollowStatus = (v: string) => {
    const newPref = { ...pref, followStatus: v }
    handleSave(newPref)
  }

  useEffect(() => {
    const savedPref = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    let p = defaultPref
    if (savedPref) {
      p = { ...p, ...JSON.parse(savedPref) }
    }
    setPref(p)
  }, [])

  const state = {
    ...pref,
    handleChangeSort,
    handleChangeFollowFilter,
    handleChangeFollowSort,
    handleChangeFollowOrder,
    handleChangeFollowStatus,
  }

  return <PrefContext.Provider value={state}>{children}</PrefContext.Provider>
}
