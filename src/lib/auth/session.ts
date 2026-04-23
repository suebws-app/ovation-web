import { cache } from 'react'
import { cookies } from 'next/headers'

export type User = {
  id: string
  email: string
  name: string
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (process.env.NODE_ENV === 'development') {
    return { id: 'dev-user', email: 'lena.serra@gmail.com', name: 'Lena Serra' }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null

  // TODO: validate token and fetch user from API
  return null
})
