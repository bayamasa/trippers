import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { destinationsRoute } from './routes/destinations'
import { toursRoute } from './routes/tours'

const app = new OpenAPIHono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
)

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.route('/v1/tours', toursRoute)
app.route('/v1/destinations', destinationsRoute)

app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Trippers API',
    description: 'Travel booking API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

const port = Number(process.env.PORT) || 3001

const server = Bun.serve({
  port,
  fetch: app.fetch,
})

console.log(`🚀 Backend server running on http://localhost:${port}`)
console.log(`📚 Swagger UI available at http://localhost:${port}/ui`)
