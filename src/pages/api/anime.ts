import type { NextApiRequest, NextApiResponse } from 'next'
import { createAnime, deleteAnime, getAllAnimesBySeason, updateAnime } from '../../services/animeService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method === 'GET') {
  //   try {
  //     const { season, nextCursor } = req.query
  //     const resp = await getAllAnimesBySeason(req.query)
  //     return res.status(200).json(resp)
  //   } catch (error) {
  //     return res.status(400).json(error)
  //   }
  // }

  // todo implement yup validation for anime object
  // todo check admin email for the action
  if (req.method === 'PUT') {
    try {
      const resp = await updateAnime({ anime: req.body.anime })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'POST') {
    try {
      const resp = await createAnime({ anime: req.body.anime })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const resp = await deleteAnime({ id: req.query.id })
      return res.status(200).json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  return res.status(405).end()
}
