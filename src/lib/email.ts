import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'メールアドレスの確認',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>メールアドレスの確認</h2>
          <p>掲示板アプリへの登録ありがとうございます。</p>
          <p>以下のボタンをクリックしてメールアドレスを確認してください：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #1976d2; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              メールアドレスを確認
            </a>
          </div>
          <p>このリンクは24時間有効です。</p>
          <p>心当たりがない場合は、このメールを無視してください。</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
    // メール送信エラーでも登録は成功させる（ユーザーに別途通知）
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'パスワードリセット',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>パスワードリセット</h2>
          <p>パスワードリセットのリクエストを受け付けました。</p>
          <p>以下のボタンをクリックして新しいパスワードを設定してください：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #1976d2; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              パスワードをリセット
            </a>
          </div>
          <p>このリンクは1時間有効です。</p>
          <p>心当たりがない場合は、このメールを無視してください。</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset email error:', error);
    // メール送信エラーでも処理は続行
  }
}