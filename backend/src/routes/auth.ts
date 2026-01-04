import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import {
  InvalidCredentialsError,
  execute as loginUsecase,
} from '@/usecases/auth/login'
import {
  EmailAlreadyExistsError,
  execute as signupUsecase,
} from '@/usecases/auth/signup'
import {
  InvalidTokenError,
  execute as verifyEmailUsecase,
} from '@/usecases/auth/verifyEmail'

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
  const input = c.req.valid('json')

  try {
    const output = await signupUsecase(input)
    return c.json(
      {
        message: '登録完了。確認メールを送信しました。',
        user: output.user,
      },
      201,
    )
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return c.json({ error: error.message }, 409)
    }
    throw error
  }
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
  const input = c.req.valid('json')

  try {
    const output = await verifyEmailUsecase(input)
    return c.json(
      {
        message: 'メールアドレスが確認されました',
        token: output.jwtToken,
      },
      200,
    )
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return c.json({ error: error.message }, 400)
    }
    throw error
  }
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
  const input = c.req.valid('json')

  try {
    const output = await loginUsecase(input)
    return c.json(output, 200)
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return c.json({ error: error.message }, 401)
    }
    throw error
  }
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
