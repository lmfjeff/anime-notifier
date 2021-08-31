import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function parseWeekday(s: string) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return dayOfWeek.indexOf(s)
}

export function toWeekday(n: number) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return dayOfWeek[n]
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

export const transformAnimeLateNight = (anime: any) => {
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
