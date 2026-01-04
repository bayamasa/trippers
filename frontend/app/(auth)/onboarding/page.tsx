'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APIError, apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth/context'

const profileSchema = z.object({
  lastName: z.string().min(1, '姓を入力してください'),
  firstName: z.string().min(1, '名を入力してください'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: '性別を選択してください',
  }),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください'),
  location: z.string().min(1, '居住地を入力してください'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading, refreshUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null)
      const token = localStorage.getItem('token')

      await apiClient('/v1/users/me/profile', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })

      await refreshUser()
      router.push('/')
    } catch (err) {
      if (err instanceof APIError) {
        const errorData = err.data as { error?: string }
        setError(errorData?.error || 'プロフィールの作成に失敗しました')
      } else {
        setError('プロフィールの作成に失敗しました')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>プロフィール設定</CardTitle>
          <CardDescription>
            あと少しで登録完了です。プロフィール情報を入力してください。
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="lastName" className="font-medium text-sm">
                  姓
                </label>
                <Input
                  id="lastName"
                  placeholder="山田"
                  {...register('lastName')}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="firstName" className="font-medium text-sm">
                  名
                </label>
                <Input
                  id="firstName"
                  placeholder="太郎"
                  {...register('firstName')}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="font-medium text-sm">
                性別
              </label>
              <Select
                onValueChange={(value) =>
                  setValue('gender', value as ProfileFormData['gender'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                  <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-destructive text-sm">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="font-medium text-sm">
                生年月日
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                aria-invalid={!!errors.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <p className="text-destructive text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="font-medium text-sm">
                居住地
              </label>
              <Input
                id="location"
                placeholder="東京都"
                {...register('location')}
                aria-invalid={!!errors.location}
              />
              {errors.location && (
                <p className="text-destructive text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '完了'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
