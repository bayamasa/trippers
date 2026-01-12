import { db } from '@db/index'
import { userAuthTable, userProfilesTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Input
export interface GetMeInput {
  userId: number
}

// Output
export interface GetMeOutput {
  id: number
  email: string
  emailVerified: boolean
  profileCompleted: boolean
  profile: {
    lastName: string
    firstName: string
    gender: string
    dateOfBirth: string
    location: string
  } | null
}

// Usecase
export async function execute(input: GetMeInput): Promise<GetMeOutput> {
  const { userId } = input

  const [result] = await db
    .select({
      auth: {
        id: userAuthTable.id,
        email: userAuthTable.email,
        emailVerified: userAuthTable.emailVerified,
      },
      profile: {
        lastName: userProfilesTable.lastName,
        firstName: userProfilesTable.firstName,
        gender: userProfilesTable.gender,
        dateOfBirth: userProfilesTable.dateOfBirth,
        location: userProfilesTable.location,
      },
    })
    .from(userAuthTable)
    .leftJoin(userProfilesTable, eq(userAuthTable.id, userProfilesTable.userId))
    .where(eq(userAuthTable.id, userId))
    .limit(1)

  const profileCompleted = result.profile?.lastName != null

  return {
    id: result.auth.id,
    email: result.auth.email,
    emailVerified: result.auth.emailVerified,
    profileCompleted,
    profile: profileCompleted ? result.profile : null,
  }
}
