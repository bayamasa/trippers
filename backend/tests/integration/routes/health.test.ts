import { createApp } from '../../../src/app'

const app = createApp()

describe('Health API - Integration', () => {
  describe('GET /health', () => {
    it('should return status ok with timestamp', async () => {
      const res = await app.request('/health')

      expect(res.status).toBe(200)

      const json = (await res.json()) as { status: string; timestamp: string }
      expect(json.status).toBe('ok')
      expect(json.timestamp).toBeDefined()
      expect(typeof json.timestamp).toBe('string')
    })
  })
})
