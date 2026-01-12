import { createApp } from './app'

const app = createApp()

const port = Number(process.env.PORT) || 3001

const server = Bun.serve({
  port,
  fetch: app.fetch,
})

console.log(`🚀 Backend server running on http://localhost:${port}`)
console.log(`📚 Swagger UI available at http://localhost:${port}/ui`)

const shutdown = () => {
  console.log('\n🛑 Shutting down server...')
  server.stop()
  console.log('👋 Server stopped gracefully')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
