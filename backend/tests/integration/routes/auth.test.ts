import { createApp } from '../../../src/app'
import { signupAndVerify } from '../helpers/auth'
import { cleanupUserByEmail } from '../setup/testDb'

const app = createApp()

const TEST_EMAIL = 'integration-auth-test@example.com'
const TEST_PASSWORD = 'Password123!'

afterAll(async () => {
  await cleanupUserByEmail(TEST_EMAIL)
})

describe('Auth API - Integration', () => {
  describe('POST /v1/auth/signup', () => {
    it('should register a new user and return 201', async () => {
      const res = await app.request('/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      })

      expect(res.status).toBe(201)

      const json = (await res.json()) as {
        message: string
        user: { id: number; email: string }
      }
      expect(json.message).toBeDefined()
      expect(json.user.email).toBe(TEST_EMAIL)
      expect(typeof json.user.id).toBe('number')
    })
  })

  describe('POST /v1/auth/verify-email', () => {
    it('should verify email with valid token and return JWT', async () => {
      // The signup already happened in the previous test, so we read the token from DB
      // We use signupAndVerify for a fresh flow in a separate test email
      const verifyEmail = 'integration-verify-test@example.com'

      try {
        const result = await signupAndVerify(app, verifyEmail, TEST_PASSWORD)

        expect(result.jwtToken).toBeDefined()
        expect(typeof result.jwtToken).toBe('string')
        expect(result.jwtToken.length).toBeGreaterThan(0)
      } finally {
        await cleanupUserByEmail(verifyEmail)
      }
    })
  })

  describe('POST /v1/auth/login', () => {
    it('should login verified user and return JWT token', async () => {
      // Use a dedicated email for login test to avoid state dependency
      const loginEmail = 'integration-login-test@example.com'

      try {
        // First sign up and verify
        await signupAndVerify(app, loginEmail, TEST_PASSWORD)

        // Then login
        const res = await app.request('/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: TEST_PASSWORD }),
        })

        expect(res.status).toBe(200)

        const json = (await res.json()) as {
          user: { id: number; email: string; emailVerified: boolean }
          token: string
        }
        expect(json.user.email).toBe(loginEmail)
        expect(json.user.emailVerified).toBe(true)
        expect(typeof json.token).toBe('string')
        expect(json.token.length).toBeGreaterThan(0)
      } finally {
        await cleanupUserByEmail(loginEmail)
      }
    })
  })
})
