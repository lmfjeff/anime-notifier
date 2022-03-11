import { AnimeDetail, AnimeOverview, FollowingAnime } from './anime'

export type GetAnimesBySeasonRequest = {
  year?: string
  season?: string
}

export type AnimeListResponse = {
  animes: AnimeOverview[]
}

export type AnimeDetailResponse = {
  anime: AnimeDetail | null
}

export type FollowingListResponse = {
  animes: FollowingAnime[]
  total: number
}
