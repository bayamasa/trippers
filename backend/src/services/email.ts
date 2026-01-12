interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // 開発環境ではコンソール出力
  if (process.env.NODE_ENV !== 'production') {
    console.log('========== EMAIL ==========')
    console.log(`To: ${options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Body: ${options.html}`)
    console.log('===========================')
    return
  }

  // TODO: 本番環境用のメール送信実装（Resend/SendGrid等）
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@trippers.example.com',
  //   ...options
  // })
}

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`

  await sendEmail({
    to: email,
    subject: '【Trippers】メールアドレスの確認',
    html: `
      <h1>メールアドレスの確認</h1>
      <p>Trippersへのご登録ありがとうございます。</p>
      <p>以下のリンクをクリックして、メールアドレスを確認してください：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>このリンクは24時間有効です。</p>
    `,
  })
}
