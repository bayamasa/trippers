import * as jose from 'jose'
import { nanoid } from 'nanoid'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
)
const JWT_EXPIRES_IN = '7d'

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 12,
  })
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return Bun.password.verify(password, hash)
}

export async function generateJWT(userId: number): Promise<string> {
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export async function verifyJWT(
  token: string,
): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as number }
  } catch {
    return null
  }
}

export function generateVerificationToken(): {
  raw: string
  hashed: string
} {
  const raw = nanoid(32)
  const hashed = Buffer.from(raw).toString('base64')
  return { raw, hashed }
}

export function hashVerificationToken(raw: string): string {
  return Buffer.from(raw).toString('base64')
}

export function getTokenExpiry(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}
