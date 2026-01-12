import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { authMiddleware } from '@/middleware/auth'
import {
  execute as createProfileUsecase,
  ProfileAlreadyExistsError,
} from '@/usecases/user/createProfile'
import { execute as getMeUsecase } from '@/usecases/user/getMe'
import {
  ProfileNotFoundError,
  execute as updateProfileUsecase,
} from '@/usecases/user/updateProfile'

const users = new OpenAPIHono()

// GET /v1/users/me - 現在のユーザー情報取得
const getMeRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Users'],
  summary: '現在のユーザー情報取得',
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: 'ユーザー情報',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            email: z.string(),
            emailVerified: z.boolean(),
            profileCompleted: z.boolean(),
            profile: z
              .object({
                lastName: z.string(),
                firstName: z.string(),
                gender: z.string(),
                dateOfBirth: z.string(),
                location: z.string(),
              })
              .nullable(),
          }),
        },
      },
    },
    401: {
      description: '認証エラー',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

users.use('/me', authMiddleware)
users.use('/me/*', authMiddleware)

users.openapi(getMeRoute, async (c) => {
  const authUser = c.get('user')
  const output = await getMeUsecase({ userId: authUser.id })
  return c.json(output, 200)
})

// POST /v1/users/me/profile - プロフィール作成（オンボーディング用）
const createProfileRoute = createRoute({
  method: 'post',
  path: '/me/profile',
  tags: ['Users'],
  summary: 'プロフィール作成',
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            lastName: z.string().min(1),
            firstName: z.string().min(1),
            gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
            dateOfBirth: z.string(),
            location: z.string().min(1),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成成功',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'プロフィール既存',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
    401: {
      description: '認証エラー',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

users.openapi(createProfileRoute, async (c) => {
  const authUser = c.get('user')
  const body = c.req.valid('json')

  try {
    await createProfileUsecase({ userId: authUser.id, ...body })
    return c.json({ message: 'プロフィールを作成しました' }, 201)
  } catch (error) {
    if (error instanceof ProfileAlreadyExistsError) {
      return c.json({ error: error.message }, 400)
    }
    throw error
  }
})

// PATCH /v1/users/me/profile - プロフィール更新
const updateProfileRoute = createRoute({
  method: 'patch',
  path: '/me/profile',
  tags: ['Users'],
  summary: 'プロフィール更新',
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            lastName: z.string().min(1).optional(),
            firstName: z.string().min(1).optional(),
            gender: z
              .enum(['male', 'female', 'other', 'prefer_not_to_say'])
              .optional(),
            dateOfBirth: z.string().optional(),
            location: z.string().min(1).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新成功',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'プロフィール未作成',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
    401: {
      description: '認証エラー',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

users.openapi(updateProfileRoute, async (c) => {
  const authUser = c.get('user')
  const body = c.req.valid('json')

  try {
    await updateProfileUsecase({ userId: authUser.id, ...body })
    return c.json({ message: 'プロフィールを更新しました' }, 200)
  } catch (error) {
    if (error instanceof ProfileNotFoundError) {
      return c.json({ error: error.message }, 404)
    }
    throw error
  }
})

export { users as usersRoute }
