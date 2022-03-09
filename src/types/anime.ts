export type AnimeOverview = {
  //uuid, primary key, partition key
  id: string
  // e.g. 2021-spring/summer/fall/winter
  yearSeason: string
  // e.g. Ousama Ranking
  title: string
  // url
  picture: string | null
  // e.g. TV / Movie / OVA / ONA / SP
  type: string
  // finished_airing | currently_airing | not_yet_aired
  status: string
  // 1-7 | other
  dayOfWeek: string | null
  // e.g. 22:15
  time: string | null
}

export type AnimeDetail = AnimeOverview & {
  alternative_titles: {
    en: string | null
    ja: string | null
    synonyms: string[] | null
  } | null
  // e.g. 20210815
  startDate: string | null
  endDate: string | null
  summary: string | null
  // e.g. ['comedy','isekai']
  genres: string[]
  // e.g. original / light novel / manga / game
  source: string | null
  studios: string[]
}

export type FollowingAnime = {
  id: string
  title: string
}
