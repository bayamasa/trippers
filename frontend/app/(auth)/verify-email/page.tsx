'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APIError, apiClient } from '@/lib/api/client'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setError('トークンが見つかりません')
      return
    }

    const verifyEmail = async () => {
      try {
        const data = await apiClient<{ token: string }>(
          '/v1/auth/verify-email',
          {
            method: 'POST',
            body: JSON.stringify({ token }),
          },
        )

        localStorage.setItem('token', data.token)
        setStatus('success')

        // 3秒後にホームへリダイレクト
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } catch (err) {
        setStatus('error')
        if (err instanceof APIError) {
          const errorData = err.data as { error?: string }
          setError(errorData?.error || '認証に失敗しました')
        } else {
          setError('認証に失敗しました')
        }
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          {status === 'loading' && (
            <>
              <CardTitle>メールアドレスを確認中...</CardTitle>
              <CardDescription>しばらくお待ちください</CardDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <CardTitle>メールアドレスが確認されました</CardTitle>
              <CardDescription>ホームに移動します...</CardDescription>
            </>
          )}
          {status === 'error' && (
            <>
              <CardTitle>認証に失敗しました</CardTitle>
              <CardDescription>{error}</CardDescription>
              <Button asChild className="mt-4">
                <Link href="/signup">新規登録に戻る</Link>
              </Button>
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>読み込み中...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
