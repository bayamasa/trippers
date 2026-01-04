import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { eq } from 'drizzle-orm'
import {
  generateVerificationToken,
  getTokenExpiry,
  hashPassword,
} from '@/services/auth'
import { sendVerificationEmail } from '@/services/email'

// Input
export interface SignupInput {
  email: string
  password: string
}

// Output
export interface SignupOutput {
  user: {
    id: number
    email: string
  }
}

// Errors
export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('このメールアドレスは既に登録されています')
    this.name = 'EmailAlreadyExistsError'
  }
}

// Usecase
export async function execute(input: SignupInput): Promise<SignupOutput> {
  const { email, password } = input

  // メール重複チェック
  const [existing] = await db
    .select({ id: userAuthTable.id })
    .from(userAuthTable)
    .where(eq(userAuthTable.email, email))
    .limit(1)

  if (existing) {
    throw new EmailAlreadyExistsError()
  }

  // パスワードハッシュ化
  const passwordHash = await hashPassword(password)

  // 認証トークン生成（raw: メール送信用、hashed: DB保存用）
  const { raw: rawToken, hashed: hashedToken } = generateVerificationToken()
  const tokenExpiry = getTokenExpiry(24)

  // ユーザー作成（base64エンコードしたトークンをDBに保存）
  const [user] = await db
    .insert(userAuthTable)
    .values({
      email,
      passwordHash,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: tokenExpiry,
    })
    .returning({ id: userAuthTable.id, email: userAuthTable.email })

  // 確認メール送信（生のトークンを送信）
  await sendVerificationEmail(email, rawToken)

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  }
}
