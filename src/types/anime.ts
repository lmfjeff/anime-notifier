export type anime = {
  //uuid, primary key, partition key
  id: string
  // e.g. 2021-spring/summer/fall/winter, sort key
  yearSeason: string

  title: string
  // url
  picture: string | null
  alternative_titles: any
  // e.g. 20210815
  startDate: string
  endDate: string | null
  summary: string | null
  // e.g. ['comedy','isekai']
  genres: string[]
  // e.g. TV / Movie / OVA / ONA / SP
  type: string
  status: string
  // 1-7
  dayOfWeek: string
  // e.g. 2215
  time: string | null
  // e.g. original / light novel / manga / game
  source: string
  studio: any
}
