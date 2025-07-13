import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'トークンとパスワードが必要です' },
        { status: 400 }
      );
    }
    
    // トークン検証
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json(
        { error: 'トークンが無効または期限切れです' },
        { status: 400 }
      );
    }
    
    // ユーザー検索
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'トークンが無効または期限切れです' },
        { status: 400 }
      );
    }
    
    // パスワード更新
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return NextResponse.json({
      message: 'パスワードが正常に更新されました'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'パスワードリセット中にエラーが発生しました' },
      { status: 500 }
    );
  }
}