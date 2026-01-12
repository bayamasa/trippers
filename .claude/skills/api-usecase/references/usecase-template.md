# Usecase Template

## 基本テンプレート

```typescript
import { db } from '@db/index'
import { someTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Input
export interface {Operation}Input {
  id: number
  // 他のパラメータ
}

// Output
export interface {Operation}Output {
  result: {
    id: number
    // 他のフィールド
  }
}

// Errors
export class {SomeError}Error extends Error {
  constructor() {
    super('エラーメッセージ')
    this.name = '{SomeError}Error'
  }
}

// Usecase
export async function execute(input: {Operation}Input): Promise<{Operation}Output> {
  const { id } = input

  // ビジネスロジック
  const [result] = await db
    .select()
    .from(someTable)
    .where(eq(someTable.id, id))
    .limit(1)

  if (!result) {
    throw new {SomeError}Error()
  }

  return { result }
}
```

## 例: 認証 (auth/signup.ts)

```typescript
import { db } from '@db/index'
import { userAuthTable } from '@db/schema'
import { eq } from 'drizzle-orm'
import {
  generateVerificationToken,
  getTokenExpiry,
  hashPassword,
} from '@/services/auth'
import { sendVerificationEmail } from '@/services/email'

// Input
export interface SignupInput {
  email: string
  password: string
}

// Output
export interface SignupOutput {
  user: {
    id: number
    email: string
  }
}

// Errors
export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('このメールアドレスは既に登録されています')
    this.name = 'EmailAlreadyExistsError'
  }
}

// Usecase
export async function execute(input: SignupInput): Promise<SignupOutput> {
  const { email, password } = input

  // 既存ユーザーチェック
  const [existingUser] = await db
    .select({ id: userAuthTable.id })
    .from(userAuthTable)
    .where(eq(userAuthTable.email, email))
    .limit(1)

  if (existingUser) {
    throw new EmailAlreadyExistsError()
  }

  // パスワードハッシュ化
  const hashedPassword = await hashPassword(password)

  // 認証トークン生成
  const { raw: rawToken, hashed: hashedToken } = generateVerificationToken()
  const tokenExpiry = getTokenExpiry()

  // ユーザー作成
  const [newUser] = await db
    .insert(userAuthTable)
    .values({
      email,
      passwordHash: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: tokenExpiry,
    })
    .returning({ id: userAuthTable.id, email: userAuthTable.email })

  // 認証メール送信
  await sendVerificationEmail(email, rawToken)

  return { user: newUser }
}
```

## 例: 取得 (user/getMe.ts)

```typescript
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
```

## 例: 更新 (user/updateProfile.ts)

```typescript
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
```

## 例: リスト取得 (tour/getTours.ts)

```typescript
import { db } from '@db/index'
import { areasTable, destinationsTable, toursTable } from '@db/schema'
import { eq } from 'drizzle-orm'

// Output
export interface GetToursOutput {
  tour: {
    id: number
    title: string
    minPriceTaxIncluded: number
    departsAirportId: number
    days: number
    isDirectFlight: boolean
    airlinesId: number
    hotelId: number
    thumbnailFileName: string
  }
  destination: {
    id: number
    slug: string
    nameJp: string
    imageFilename: string
  }
  area: {
    name: string
    nameJp: string
  }
}

// Usecase
export async function execute(): Promise<GetToursOutput[]> {
  const toursList = await db
    .select({
      tour: {
        id: toursTable.id,
        title: toursTable.title,
        minPriceTaxIncluded: toursTable.minPriceTaxIncluded,
        departsAirportId: toursTable.departsAirportId,
        days: toursTable.days,
        isDirectFlight: toursTable.isDirectFlight,
        airlinesId: toursTable.airlinesId,
        hotelId: toursTable.hotelId,
        thumbnailFileName: toursTable.thumbnailFileName,
      },
      destination: {
        id: destinationsTable.id,
        slug: destinationsTable.slug,
        nameJp: destinationsTable.nameJp,
        imageFilename: destinationsTable.imageFilename,
      },
      area: {
        name: areasTable.name,
        nameJp: areasTable.nameJp,
      },
    })
    .from(toursTable)
    .innerJoin(
      destinationsTable,
      eq(toursTable.destinationId, destinationsTable.id),
    )
    .innerJoin(areasTable, eq(destinationsTable.areaId, areasTable.id))

  return toursList
}
```
