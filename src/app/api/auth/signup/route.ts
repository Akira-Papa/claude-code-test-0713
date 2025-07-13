import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password, name } = await request.json();
    
    // 既存ユーザーチェック
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }
    
    // 検証トークン生成
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    // ユーザー作成
    const user = await User.create({
      email,
      password,
      name,
      verificationToken,
      // 開発環境では自動的にメール確認済みにする（本番環境ではfalse）
      emailVerified: process.env.NODE_ENV === 'development' ? true : false,
    });
    
    // 確認メール送信（エラーがあっても続行）
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }
    
    return NextResponse.json({
      message: process.env.NODE_ENV === 'development' 
        ? '登録が完了しました。開発環境のため、すぐにログインできます。'
        : '登録が完了しました。確認メールをご確認ください。',
      userId: user._id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '登録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}