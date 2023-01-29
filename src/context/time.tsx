import { Dayjs } from 'dayjs'
import React, { createContext, useEffect, useState } from 'react'
import { gethkNow } from '../utils/date'

type Props = {
  children: React.ReactNode
}

export const TimeContext = createContext<Dayjs | null>(null)

export default function TimeProvider({ children }: Props) {
  const [time, setTime] = useState<Dayjs | null>(null)

  useEffect(() => {
    setTime(gethkNow())
  }, [])

  return <TimeContext.Provider value={time}>{children}</TimeContext.Provider>
}
