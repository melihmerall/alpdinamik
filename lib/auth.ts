import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(email: string, password: string, name: string, role: UserRole = 'EDITOR') {
  const passwordHash = await hashPassword(password)
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
    },
  })
}

