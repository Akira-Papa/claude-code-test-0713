import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // セキュリティのため、ユーザーが存在しない場合も成功レスポンスを返す
      return NextResponse.json({
        message: 'メールアドレスが登録されている場合、パスワードリセットメールを送信しました。'
      });
    }
    
    // リセットトークン生成
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    
    // トークンと有効期限を保存
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1時間後
    await user.save();
    
    // リセットメール送信
    await sendPasswordResetEmail(email, resetToken);
    
    return NextResponse.json({
      message: 'メールアドレスが登録されている場合、パスワードリセットメールを送信しました。'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'パスワードリセット処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}