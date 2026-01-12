import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { and, eq, gt } from 'drizzle-orm'
import { generateJWT, hashVerificationToken } from '@/services/auth'

// Input
export interface VerifyEmailInput {
  token: string
}

// Output
export interface VerifyEmailOutput {
  jwtToken: string
}

// Errors
export class InvalidTokenError extends Error {
  constructor() {
    super('無効または期限切れのトークンです')
    this.name = 'InvalidTokenError'
  }
}

// Usecase
export async function execute(
  input: VerifyEmailInput,
): Promise<VerifyEmailOutput> {
  const { token } = input

  // 受け取った生トークンをbase64エンコードしてDBと比較
  const hashedToken = hashVerificationToken(token)

  const [user] = await db
    .select()
    .from(userAuthTable)
    .where(
      and(
        eq(userAuthTable.emailVerificationToken, hashedToken),
        gt(userAuthTable.emailVerificationTokenExpiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!user) {
    throw new InvalidTokenError()
  }

  // メール認証完了
  await db
    .update(userAuthTable)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
    })
    .where(eq(userAuthTable.id, user.id))

  // JWTトークン発行
  const jwtToken = await generateJWT(user.id)

  return { jwtToken }
}
