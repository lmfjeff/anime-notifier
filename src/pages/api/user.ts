import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '../../services/prisma/user.service'
import { userRegisterSchema } from '../../utils/validation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (req.method === 'POST') {
    try {
      const { username, password, recaptcha_token } = await userRegisterSchema.validate(req.body)
      const { data } = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha_token}`
      )
      if (!data?.success) {
        throw new Error('Recaptcha 驗證失敗/過期 請再試')
      }
      const user = await createUser(username, password)
      res.status(200).json(user)
    } catch (error: any) {
      console.log('error: ', JSON.stringify(error, null, 2))
      res.status(400).json({ error: error?.message || 'Unknown error occured' })
    }
  }
  res.status(405).end()
}
