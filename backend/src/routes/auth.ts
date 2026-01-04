import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { and, eq, gt } from 'drizzle-orm'
import { sendVerificationEmail } from '../services/email'
import {
  generateJWT,
  generateVerificationToken,
  getTokenExpiry,
  hashPassword,
  verifyPassword,
} from '../utils/auth'

const auth = new OpenAPIHono()

// POST /v1/auth/signup - ユーザー登録
const signupRoute = createRoute({
  method: 'post',
  path: '/signup',
  tags: ['Auth'],
  summary: 'ユーザー登録',
  description:
    'メールとパスワードでユーザーを登録します。確認メールが送信されます。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '登録成功',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    400: {
      description: 'バリデーションエラー',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
    409: {
      description: 'メールアドレス重複',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

auth.openapi(signupRoute, async (c) => {
  const { email, password } = c.req.valid('json')

  // メール重複チェック
  const [existing] = await db
    .select({ id: userAuthTable.id })
    .from(userAuthTable)
    .where(eq(userAuthTable.email, email))
    .limit(1)

  if (existing) {
    return c.json({ error: 'このメールアドレスは既に登録されています' }, 409)
  }

  // パスワードハッシュ化
  const passwordHash = await hashPassword(password)

  // 認証トークン生成
  const verificationToken = generateVerificationToken()
  const tokenExpiry = getTokenExpiry(24)

  // ユーザー作成
  const [user] = await db
    .insert(userAuthTable)
    .values({
      email,
      passwordHash,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: tokenExpiry,
    })
    .returning({ id: userAuthTable.id, email: userAuthTable.email })

  // 確認メール送信
  await sendVerificationEmail(email, verificationToken)

  return c.json(
    {
      message: '登録完了。確認メールを送信しました。',
      user: { id: user.id, email: user.email },
    },
    201,
  )
})

// POST /v1/auth/verify-email - メール認証
const verifyEmailRoute = createRoute({
  method: 'post',
  path: '/verify-email',
  tags: ['Auth'],
  summary: 'メール認証',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '認証成功',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    400: {
      description: '無効なトークン',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

auth.openapi(verifyEmailRoute, async (c) => {
  const { token } = c.req.valid('json')

  const [user] = await db
    .select()
    .from(userAuthTable)
    .where(
      and(
        eq(userAuthTable.emailVerificationToken, token),
        gt(userAuthTable.emailVerificationTokenExpiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!user) {
    return c.json({ error: '無効または期限切れのトークンです' }, 400)
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

  return c.json(
    {
      message: 'メールアドレスが確認されました',
      token: jwtToken,
    },
    200,
  )
})

// POST /v1/auth/login - ログイン
const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  summary: 'ログイン',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'ログイン成功',
      content: {
        'application/json': {
          schema: z.object({
            user: z.object({
              id: z.number(),
              email: z.string(),
              emailVerified: z.boolean(),
            }),
            token: z.string(),
          }),
        },
      },
    },
    401: {
      description: '認証失敗',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

auth.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid('json')

  const [user] = await db
    .select()
    .from(userAuthTable)
    .where(eq(userAuthTable.email, email))
    .limit(1)

  if (!user) {
    return c.json(
      { error: 'メールアドレスまたはパスワードが正しくありません' },
      401,
    )
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return c.json(
      { error: 'メールアドレスまたはパスワードが正しくありません' },
      401,
    )
  }

  const token = await generateJWT(user.id)

  return c.json(
    {
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      token,
    },
    200,
  )
})

// POST /v1/auth/logout - ログアウト
const logoutRoute = createRoute({
  method: 'post',
  path: '/logout',
  tags: ['Auth'],
  summary: 'ログアウト',
  responses: {
    200: {
      description: 'ログアウト成功',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
})

auth.openapi(logoutRoute, async (c) => {
  // JWTはステートレスなので、クライアント側でトークン削除
  return c.json({ message: 'ログアウトしました' }, 200)
})

export { auth as authRoute }
