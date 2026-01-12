import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { eq } from 'drizzle-orm'
import { generateJWT, verifyPassword } from '@/services/auth'

// Input
export interface LoginInput {
  email: string
  password: string
}

// Output
export interface LoginOutput {
  user: {
    id: number
    email: string
    emailVerified: boolean
  }
  token: string
}

// Errors
export class InvalidCredentialsError extends Error {
  constructor() {
    super('メールアドレスまたはパスワードが正しくありません')
    this.name = 'InvalidCredentialsError'
  }
}

// Usecase
export async function execute(input: LoginInput): Promise<LoginOutput> {
  const { email, password } = input

  const [user] = await db
    .select()
    .from(userAuthTable)
    .where(eq(userAuthTable.email, email))
    .limit(1)

  if (!user) {
    throw new InvalidCredentialsError()
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    throw new InvalidCredentialsError()
  }

  const token = await generateJWT(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    },
    token,
  }
}
