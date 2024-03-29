import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { weekdayOption, seasonOption } from '../constants/animeOption'
import { GetAnimesBySeasonRequest } from '../types/api'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Hong_Kong')

export function gethkNow(): Dayjs {
  return dayjs().tz('Asia/Hong_Kong')
}

export function getYearSeason(): { year: string; season: string } {
  const today = gethkNow()
  const year = today.year().toString()
  const season = month2Season(today.month() + 1)
  return { year, season }
}

// e.g. 202201
export function getYearMonth(nextSeason?: boolean): string {
  let today = gethkNow()
  if (nextSeason) today = today.add(3, 'M')
  const year = today.year()
  const monthIndex = today.month()

  const adjustedMonth = Math.floor(monthIndex / 3) * 3 + 1
  const adjustedMonthString = adjustedMonth.toString().padStart(2, '0')
  return `${year}${adjustedMonthString}`
}

export function formatTimeDetailed(time: Dayjs): string {
  return time.tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss [GMT]ZZ')
}

export function formatHKMonthDay(d: Dayjs): string {
  return d.format('DD/MM')
}

export function parseFromDateTime(s: string): Dayjs | null {
  if (!dayjs(s, 'YYYY-MM-DD HH:mm').isValid()) return null
  return dayjs.tz(s, 'YYYY-MM-DD HH:mm', 'Asia/Hong_Kong')
}

export function parseFromDateTimeJP(s: string): Dayjs | null {
  if (!dayjs(s, 'YYYY-MM-DD HH:mm').isValid()) return null
  return dayjs.tz(s, 'YYYY-MM-DD HH:mm', 'Japan')
}

export function parseFromTimeJP(s: string): Dayjs | null {
  if (!dayjs(s, 'HH:mm').isValid()) return null
  return dayjs.tz(s, 'HH:mm', 'Japan')
}

export function parseToDayjs(timeString: string | Date): Dayjs {
  return dayjs(timeString)
}

export function parseWeekday(s?: string | null): number {
  if (!s) return -1
  return weekdayOption.indexOf(s)
}

function toWeekday(n: number): string {
  return weekdayOption[n]
}

export function sortDay(a: any, b: any) {
  if (!a.dayOfWeek?.jp) return 1
  if (!b.dayOfWeek?.jp) return -1
  return parseWeekday(a.dayOfWeek?.jp) - parseWeekday(b.dayOfWeek?.jp)
}

export function sortTime(a: any, b: any) {
  if (!a.time?.jp) return 1
  if (!b.time?.jp) return -1
  return a.time?.jp > b.time?.jp ? 1 : -1
}

export function jp2hk(anime: any): any {
  if (!anime.time?.jp) return anime

  let transformedTime
  let transformedDay
  if (anime.dayOfWeek?.jp) {
    const dayjsJP = parseFromTimeJP(anime.time?.jp)?.day(parseWeekday(anime.dayOfWeek?.jp))
    if (dayjsJP) {
      const dayjsHK = dayjsJP.tz('Asia/Hong_Kong')
      transformedDay = toWeekday(dayjsHK.day())
      transformedTime = dayjsHK.format('HH:mm')
    }
  }

  let transformedStartDate
  if (anime.startDate?.jp) {
    const startDayjsJP = parseFromDateTimeJP(`${anime.startDate?.jp} ${anime.time?.jp}`)
    const startDayjsHK = startDayjsJP?.tz('Asia/Hong_Kong')
    transformedStartDate = startDayjsHK?.format('YYYY-MM-DD')
  }

  let transformedEndDate
  if (anime.endDate?.jp) {
    const endDayjsJP = parseFromDateTimeJP(`${anime.endDate?.jp} ${anime.time?.jp}`)
    const endDayjsHK = endDayjsJP?.tz('Asia/Hong_Kong')
    transformedEndDate = endDayjsHK?.format('YYYY-MM-DD')
  }

  return {
    ...anime,
    time: { jp: transformedTime },
    dayOfWeek: { jp: transformedDay } || null,
    startDate: { jp: transformedStartDate } || null,
    endDate: { jp: transformedEndDate } || null,
  }
}

export function transformAnimeLateNight(anime: any): any {
  if (!anime.time?.jp) return anime
  const dayjsHK = dayjs(anime.time?.jp, 'HH:mm')
  if (dayjsHK.hour() > 5) return anime

  const transformedTime = `${dayjsHK.hour() + 24}:${dayjsHK.format('mm')}`

  let transformedDay
  if (anime.dayOfWeek?.jp) {
    const newDayjsHK = dayjsHK.day(parseWeekday(anime.dayOfWeek?.jp))
    transformedDay = toWeekday(newDayjsHK.subtract(1, 'day').day())
  }

  let transformedStartDate
  if (anime.startDate?.jp) {
    const startDayjs = parseFromDateTimeJP(`${anime.startDate?.jp} ${anime.time?.jp}`)
    transformedStartDate = startDayjs?.subtract(1, 'day')?.format('YYYY-MM-DD')
  }

  let transformedEndDate
  if (anime.endDate?.jp) {
    const endDayjs = parseFromDateTimeJP(`${anime.endDate?.jp} ${anime.time?.jp}`)
    transformedEndDate = endDayjs?.subtract(1, 'day')?.format('YYYY-MM-DD')
  }

  return {
    ...anime,
    time: { jp: transformedTime },
    dayOfWeek: { jp: transformedDay } || null,
    startDate: { jp: transformedStartDate } || null,
    endDate: { jp: transformedEndDate } || null,
  }
}

export function reorderByDate(animes: any[], hour: number, day: number): any[] {
  const today = hour <= 5 ? day - 1 : day
  const unknown = animes.pop()
  const shifted = animes.slice(0, today)
  const remained = animes.slice(today)
  return [...remained, ...shifted, unknown]
}

// if input 2 (二), today is 四, [0,1,2,3,4,5,6] -> [4,5,6,0,1,2,3], output index will be 5
export function reorderIndexFromToday(index: number, hour: number, day: number): number {
  const today = hour <= 5 ? day - 1 : day
  const newIndex = index - today
  return newIndex < 0 ? newIndex + 7 : newIndex >= 7 ? newIndex - 7 : newIndex
}

export function reorderIndexFromSunday(index: number, hour: number, day: number): number {
  if (index >= 7) return index
  const today = hour <= 5 ? day - 1 : day
  const newIndex = index + today
  return newIndex < 0 ? newIndex + 7 : newIndex >= 7 ? newIndex - 7 : newIndex
}

export function month2Season(n: number): string {
  if (n >= 1 && n <= 3) {
    return 'winter'
  }
  if (n >= 4 && n <= 6) {
    return 'spring'
  }
  if (n >= 7 && n <= 9) {
    return 'summer'
  }
  if (n >= 10 && n <= 12) {
    return 'fall'
  }
  throw Error('month number out of range')
}

export function pastSeason({ year, season }: GetAnimesBySeasonRequest): GetAnimesBySeasonRequest {
  const seasonIndex = seasonOption.indexOf(season || '')
  return seasonIndex === 0
    ? { year: (parseInt(year || '') - 1).toString(), season: seasonOption[seasonOption.length - 1] }
    : { year, season: seasonOption[seasonIndex - 1] }
}

export function nextSeason({ year, season }: GetAnimesBySeasonRequest): GetAnimesBySeasonRequest {
  const seasonIndex = seasonOption.indexOf(season || '')
  return seasonIndex === seasonOption.length - 1
    ? { year: (parseInt(year || '') + 1).toString(), season: seasonOption[0] }
    : { year, season: seasonOption[seasonIndex + 1] }
}

// convert yearSeason to array of past N seasons
// e.g. '2022-spring' -> ['2021-summer', '2021-autumn', '2022-winter']
// export function pastSeasons(season: string, numOfSeason: number): string[] {
//   const [yr, sn] = season.split('-')
//   const lastSeason = pastSeason({ year: yr, season: sn })
//   const lastSeasonString = `${lastSeason.year}-${lastSeason.season}`
//   if (numOfSeason === 1) {
//     return [lastSeasonString]
//   } else {
//     return [...pastSeasons(lastSeasonString, numOfSeason - 1), lastSeasonString]
//   }
// }

export function pastSeasons(year: number, season: number, numOfSeason: number) {
  const list = []
  for (let i = 0; i < numOfSeason; i++) {
    year = season === 1 ? year - 1 : year
    season = season === 1 ? 4 : season - 1
    list.push({ year, season })
  }
  return list
}
