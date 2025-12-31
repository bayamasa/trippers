import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { swaggerUI } from '@hono/swagger-ui'
import { toursRoute } from './routes/tours'
import { destinationsRoute } from './routes/destinations'

const app = new OpenAPIHono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.route('/v1/tours', toursRoute)
app.route('/v1/destinations', destinationsRoute)

// OpenAPI仕様書のエンドポイント
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Trippers API',
    description: 'Travel booking API for Trippers application',
  },
})

// Swagger UIのエンドポイント
app.get('/ui', swaggerUI({ url: '/doc' }))

const port = process.env.PORT || 3001

export default {
  port,
  fetch: app.fetch,
}

console.log(`🚀 Backend server running on http://localhost:${port}`)
console.log(`📚 Swagger UI available at http://localhost:${port}/ui`)
