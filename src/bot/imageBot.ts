/**
 * 1. get dynamodb animes by certain amount (e.g. 1-3)
 * 2. ignore picture in relative path (e.g. /img/123.webp)
 * 3. extract id, picture from each anime
 *
 * 4. download image from mal, compress & convert to webp
 * 5. upload to s3 bucket
 * 6. update anime in dynamodb to { picture: /img/123.webp }
 *
 * 7. repeat 4-6 for each anime
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import axios from "axios"
import sharp from "sharp"
import { getAnimesBySeason, updateAnime } from "../services/animeService"
import { AnimeDetail } from "../types/anime"
import { getYearSeason } from "../utils/date"

if (typeof require !== 'undefined' && require.main === module) {
  handler()
}

const s3Client = new S3Client({
  region: process.env.DYNAMODB_REGION,
})

export async function handler() {
  console.log("start compress anime image")

  const { year, season } = getYearSeason()

  const { animes } = await getAnimesBySeason({ year, season })

  console.log('animes length', animes.length)

  const DOWNLOAD_LIMIT = process.env.DOWNLOAD_LIMIT || 1
  console.log('download limit: ', DOWNLOAD_LIMIT)
  let count = 0
  for (const anime of animes) {
    if (
      anime.type === "tv" &&
      anime.picture &&
      anime.picture.includes("http")
    ) {
      const response = await axios.get(anime.picture, {
        responseType: "arraybuffer",
      })
      const image = sharp(response.data)
      const buffer = await image.webp().toBuffer()
      const path = `img/${anime.id}.webp`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: "anime-notifier",
          Key: path,
          Body: buffer,
          ContentType: "image/webp",
        })
      )

      await updateAnime({ anime: { id: anime.id, picture: path } as AnimeDetail })
      console.log("picture changed for: ", anime.title)
      count++
    }
    if (count === DOWNLOAD_LIMIT) {
      console.log('reach download limit')
      break
    }
  }
  console.log("finish compress anime image")
}
