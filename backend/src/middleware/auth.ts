import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { eq } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import { verifyJWT } from '@/services/auth'

export type AuthUser = {
  id: number
  email: string
  emailVerified: boolean
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)
  const payload = await verifyJWT(token)

  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const [user] = await db
    .select({
      id: userAuthTable.id,
      email: userAuthTable.email,
      emailVerified: userAuthTable.emailVerified,
    })
    .from(userAuthTable)
    .where(eq(userAuthTable.id, payload.userId))
    .limit(1)

  if (!user) {
    return c.json({ error: 'User not found' }, 401)
  }

  c.set('user', user)
  await next()
})

export const optionalAuthMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyJWT(token)

    if (payload) {
      const [user] = await db
        .select({
          id: userAuthTable.id,
          email: userAuthTable.email,
          emailVerified: userAuthTable.emailVerified,
        })
        .from(userAuthTable)
        .where(eq(userAuthTable.id, payload.userId))
        .limit(1)

      if (user) {
        c.set('user', user)
      }
    }
  }

  await next()
})
