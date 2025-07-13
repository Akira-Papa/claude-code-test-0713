import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'トークンが提供されていません' },
        { status: 400 }
      );
    }
    
    // トークン検証
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    } catch {
      return NextResponse.json(
        { error: 'トークンが無効または期限切れです' },
        { status: 400 }
      );
    }
    
    // ユーザー検索と更新
    const user = await User.findOne({ 
      email: decoded.email,
      verificationToken: token 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }
    
    // メール確認済みに更新
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return NextResponse.json({
      message: 'メールアドレスが確認されました。ログインできます。'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'メール確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}