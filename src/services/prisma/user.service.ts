import { compare, hash } from 'bcrypt'
import { prismaClient } from '../../lib/prisma'
import { exclude } from '../../utils/utils'

export async function createUser(username: string, password: string) {
  const existingUser = await prismaClient.user.findFirst({
    where: {
      username,
    },
  })
  if (existingUser) throw Error('用戶名已被其他人使用')

  const hashedPw = await hash(password, 10)

  const user = await prismaClient.user.create({
    data: {
      username,
      password: hashedPw,
    },
  })

  return exclude(user, 'password')
}

export async function loginUser(username: string, password: string) {
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    console.error('User not exist')
    throw new Error('用戶名不存在')
  }

  const isValid = user.password && (await compare(password, user.password))
  if (!isValid) {
    console.error('Wrong password')
    throw new Error('密碼錯誤')
  }

  return user
}
