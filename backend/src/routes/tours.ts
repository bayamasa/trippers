import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ToursResponse } from '@trippers/shared/schemas/responses'
import { execute as getToursUsecase } from '@/usecases/tour/getTours'

const tours = new OpenAPIHono()

// GET /api/tours - 全ツアー一覧取得
const getToursRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Tours'],
  summary: '全ツアー一覧を取得',
  description: 'すべてのツアー情報を目的地とエリア情報と共に取得します',
  responses: {
    200: {
      description: 'ツアー一覧の取得に成功',
      content: {
        'application/json': {
          schema: ToursResponse,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
})

tours.openapi(getToursRoute, async (c) => {
  try {
    const output = await getToursUsecase()
    return c.json(output, 200)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return c.json({ error: 'Failed to fetch tours' }, 500)
  }
})

export { tours as toursRoute }
