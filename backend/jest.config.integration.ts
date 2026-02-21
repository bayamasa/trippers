import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/tests/integration/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/integration/setup/jestSetup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@db/index$': '<rootDir>/../db/index.ts',
    '^@db/schema$': '<rootDir>/../db/schema.ts',
    '^@trippers/shared$': '<rootDir>/../shared/src',
    '^@trippers/shared/(.*)$': '<rootDir>/../shared/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 30000,
  globalSetup: '<rootDir>/tests/integration/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/integration/setup/globalTeardown.ts',
}

export default config
