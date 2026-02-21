export default async function globalTeardown(): Promise<void> {
  // Per-test cleanup is handled in individual test files' afterAll hooks.
  // Close the shared test DB pool used by testDb.ts helpers.
  try {
    const { closeTestDb } = await import('./testDb')
    await closeTestDb()
  } catch {
    // ignore if not connected
  }
  console.log('Integration test suite completed')
}
