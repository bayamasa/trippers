import bcryptjs from 'bcryptjs'

// Polyfill Bun.password for Jest/Node.js environment
// The backend services use Bun.password.hash and Bun.password.verify
// which are not available in Node.js. We replace them with bcryptjs equivalents.
globalThis.Bun = {
  ...((globalThis as unknown as { Bun?: Record<string, unknown> }).Bun || {}),
  password: {
    hash: async (
      password: string,
      options?: { algorithm?: string; cost?: number },
    ): Promise<string> => {
      const cost = options?.cost ?? 10
      return bcryptjs.hash(password, cost)
    },
    verify: async (password: string, hash: string): Promise<boolean> => {
      return bcryptjs.compare(password, hash)
    },
  },
} as typeof Bun

// Set test environment
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://trippers:trippers@localhost:5432/trippers'
