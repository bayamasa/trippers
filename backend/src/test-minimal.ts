import { Hono } from 'hono'

const app = new Hono()

app.get('/test', (c) => {
  return c.json({ ok: true })
})

const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
})

console.log('Test server on 3003')
