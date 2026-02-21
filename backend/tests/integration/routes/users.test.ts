import { createApp } from '../../../src/app'
import { signupAndVerify } from '../helpers/auth'
import { cleanupUserByEmail } from '../setup/testDb'

const app = createApp()

const TEST_EMAIL = 'integration-users-test@example.com'
const TEST_PASSWORD = 'Password123!'

let jwtToken: string

beforeAll(async () => {
  const result = await signupAndVerify(app, TEST_EMAIL, TEST_PASSWORD)
  jwtToken = result.jwtToken
})

afterAll(async () => {
  await cleanupUserByEmail(TEST_EMAIL)
})

describe('Users API - Integration', () => {
  describe('GET /v1/users/me', () => {
    it('should return current user info with valid JWT', async () => {
      const res = await app.request('/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      expect(res.status).toBe(200)

      const json = (await res.json()) as {
        id: number
        email: string
        emailVerified: boolean
        profileCompleted: boolean
        profile: null | object
      }
      expect(json.email).toBe(TEST_EMAIL)
      expect(json.emailVerified).toBe(true)
      expect(json.profileCompleted).toBe(false)
      expect(json.profile).toBeNull()
    })

    it('should return 401 without Authorization header', async () => {
      const res = await app.request('/v1/users/me', {
        method: 'GET',
      })

      expect(res.status).toBe(401)
    })
  })

  describe('POST /v1/users/me/profile', () => {
    it('should create a user profile and return 201', async () => {
      const profileData = {
        lastName: 'テスト',
        firstName: '太郎',
        gender: 'male',
        dateOfBirth: '1990-01-15',
        location: '東京都',
      }

      const res = await app.request('/v1/users/me/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      expect(res.status).toBe(201)

      const json = (await res.json()) as { message: string }
      expect(json.message).toBeDefined()
    })
  })

  describe('PATCH /v1/users/me/profile', () => {
    it('should update an existing user profile and return 200', async () => {
      const updateData = {
        firstName: '次郎',
        location: '大阪府',
      }

      const res = await app.request('/v1/users/me/profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      expect(res.status).toBe(200)

      const json = (await res.json()) as { message: string }
      expect(json.message).toBeDefined()
    })

    it('should reflect updated profile in GET /v1/users/me', async () => {
      const res = await app.request('/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      expect(res.status).toBe(200)

      const json = (await res.json()) as {
        profileCompleted: boolean
        profile: {
          lastName: string
          firstName: string
          gender: string
          dateOfBirth: string
          location: string
        } | null
      }
      expect(json.profileCompleted).toBe(true)
      expect(json.profile).not.toBeNull()
      expect(json.profile?.firstName).toBe('次郎')
      expect(json.profile?.location).toBe('大阪府')
    })
  })
})
