import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { toursRoute } from './routes/tours'
import { destinationsRoute } from './routes/destinations'

const app = new Hono()

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

app.route('/api/tours', toursRoute)
app.route('/api/destinations', destinationsRoute)

const port = process.env.PORT || 3001

export default {
  port,
  fetch: app.fetch,
}

console.log(`🚀 Backend server running on http://localhost:${port}`)
