import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { weekdayOption, seasonOption } from '../constants/animeOption'

dayjs.extend(customParseFormat)

export function parseWeekday(s: string) {
  return weekdayOption.indexOf(s)
}

export function toWeekday(n: number) {
  return weekdayOption[n]
}

export function sortDay(a: any, b: any) {
  if (!a.dayOfWeek) return 1
  if (!b.dayOfWeek) return -1
  return parseWeekday(a.dayOfWeek) - parseWeekday(b.dayOfWeek)
}

export function sortTime(a: any, b: any) {
  if (!a.time) return 1
  if (!b.time) return -1
  return a.time > b.time ? 1 : -1
}

export function jp2hk(anime: any) {
  if (!anime.time || !anime.dayOfWeek) return anime
  const day = parseWeekday(anime.dayOfWeek)
  const time = dayjs(anime.time, 'HH:mm').day(day)
  const transformedTime = time.subtract(1, 'hour')
  const transformedDay = toWeekday(transformedTime.day())
  const transformedAnime = { ...anime, time: transformedTime.format('HH:mm'), dayOfWeek: transformedDay }
  return transformedAnime
}

export function transformAnimeLateNight(anime: any) {
  if (!anime.dayOfWeek || !anime.time) return anime
  const day = parseWeekday(anime.dayOfWeek)
  if (day === -1) return anime
  const time = dayjs(anime.time, 'HH:mm').day(day)
  if (time.hour() >= 0 && time.hour() <= 3) {
    const transformedTime = `${time.hour() + 24}:${time.format('mm')}`
    const transformedDay = toWeekday(time.subtract(1, 'day').day())
    const transformedAnime = { ...anime, time: transformedTime, dayOfWeek: transformedDay }
    return transformedAnime
  }
  return anime
}

export function reorderByDate(animes: any[]) {
  const shift = dayjs().day()
  const unknown = animes.pop()
  const shifted = animes.slice(0, shift)
  const remained = animes.slice(shift)
  return [...remained, ...shifted, unknown]
}

export function month2Season(n: number): string | undefined {
  let season
  if (n >= 1 && n <= 3) {
    season = 'winter'
  }
  if (n >= 4 && n <= 6) {
    season = 'spring'
  }
  if (n >= 7 && n <= 9) {
    season = 'summer'
  }
  if (n >= 10 && n <= 12) {
    season = 'autumn'
  }
  return season
}

// convert yearSeason to array of past 3 season
// e.g. '2022-spring' -> ['2021-summer', '2021-autumn', '2022-winter']
export function past3Seasons(season: string): string[] {
  const [yr, sn] = season.split('-')
  const lastYr = (parseInt(yr) - 1).toString()
  const thisSeasonNum = seasonOption.indexOf(sn)
  const lastYrSeason = seasonOption.slice(thisSeasonNum + 1)
  const thisYrSeason = seasonOption.slice(0, thisSeasonNum)
  return [...lastYrSeason.map(el => lastYr + '-' + el), ...thisYrSeason.map(el => yr + '-' + el)]
}
