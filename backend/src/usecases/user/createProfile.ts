import { db } from '@db/index'
import { userProfilesTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Input
export interface CreateProfileInput {
  userId: number
  lastName: string
  firstName: string
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  dateOfBirth: string
  location: string
}

// Errors
export class ProfileAlreadyExistsError extends Error {
  constructor() {
    super('プロフィールは既に作成されています')
    this.name = 'ProfileAlreadyExistsError'
  }
}

// Usecase
export async function execute(input: CreateProfileInput): Promise<void> {
  const { userId, lastName, firstName, gender, dateOfBirth, location } = input

  // 既存プロフィールチェック
  const [existing] = await db
    .select({ id: userProfilesTable.id })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1)

  if (existing) {
    throw new ProfileAlreadyExistsError()
  }

  await db.insert(userProfilesTable).values({
    userId,
    lastName,
    firstName,
    gender,
    dateOfBirth,
    location,
  })
}
