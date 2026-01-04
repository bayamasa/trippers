import { db } from '@db/index'
import { userProfilesTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Input
export interface UpdateProfileInput {
  userId: number
  lastName?: string
  firstName?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  dateOfBirth?: string
  location?: string
}

// Errors
export class ProfileNotFoundError extends Error {
  constructor() {
    super('プロフィールが見つかりません')
    this.name = 'ProfileNotFoundError'
  }
}

// Usecase
export async function execute(input: UpdateProfileInput): Promise<void> {
  const { userId, ...updateData } = input

  // プロフィール存在チェック
  const [existing] = await db
    .select({ id: userProfilesTable.id })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1)

  if (!existing) {
    throw new ProfileNotFoundError()
  }

  await db
    .update(userProfilesTable)
    .set(updateData)
    .where(eq(userProfilesTable.userId, userId))
}
