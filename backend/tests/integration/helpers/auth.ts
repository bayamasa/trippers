import type { OpenAPIHono } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { userAuthTable } from '../../../../db/schema'
import { getTestDb } from '../setup/testDb'

export interface AuthResult {
  userId: number
  email: string
  jwtToken: string
}

/**
 * Performs the full signup -> verifyEmail flow and returns a JWT token.
 * The verification token is read directly from the DB (stored as base64 of nanoid),
 * then decoded to get the raw token to send to the verify-email endpoint.
 */
export async function signupAndVerify(
  app: OpenAPIHono,
  email: string,
  password: string,
): Promise<AuthResult> {
  // 1. Signup
  const signupRes = await app.request('/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (signupRes.status !== 201) {
    const body = await signupRes.json()
    throw new Error(
      `Signup failed with status ${signupRes.status}: ${JSON.stringify(body)}`,
    )
  }

  const signupBody = (await signupRes.json()) as {
    user: { id: number; email: string }
  }
  const userId = signupBody.user.id

  // 2. Read the hashed token from DB and decode to get raw token
  const db = getTestDb()
  const [userRecord] = await db
    .select({ emailVerificationToken: userAuthTable.emailVerificationToken })
    .from(userAuthTable)
    .where(eq(userAuthTable.id, userId))
    .limit(1)

  if (!userRecord?.emailVerificationToken) {
    throw new Error('Email verification token not found in DB')
  }

  // The hashed token is Buffer.from(rawToken).toString('base64')
  // So to recover rawToken: Buffer.from(hashedToken, 'base64').toString('utf-8')
  const rawToken = Buffer.from(
    userRecord.emailVerificationToken,
    'base64',
  ).toString('utf-8')

  // 3. Verify email
  const verifyRes = await app.request('/v1/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: rawToken }),
  })

  if (verifyRes.status !== 200) {
    const body = await verifyRes.json()
    throw new Error(
      `Email verification failed with status ${verifyRes.status}: ${JSON.stringify(body)}`,
    )
  }

  const verifyBody = (await verifyRes.json()) as { token: string }

  return {
    userId,
    email,
    jwtToken: verifyBody.token,
  }
}

/**
 * Performs login and returns the JWT token.
 */
export async function login(
  app: OpenAPIHono,
  email: string,
  password: string,
): Promise<string> {
  const res = await app.request('/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (res.status !== 200) {
    const body = await res.json()
    throw new Error(
      `Login failed with status ${res.status}: ${JSON.stringify(body)}`,
    )
  }

  const body = (await res.json()) as { token: string }
  return body.token
}
