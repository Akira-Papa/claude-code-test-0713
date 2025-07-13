import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let query = {};
    if (category && category !== 'all') {
      query = { category };
    }
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック（オプション：認証なしでも投稿可能にする場合はコメントアウト）
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, error: '投稿するにはログインが必要です' },
    //     { status: 401 }
    //   );
    // }
    
    await dbConnect();
    
    const body = await request.json();
    
    // 認証ユーザーがいる場合はuserIdを追加
    if (session?.user?.id) {
      body.userId = session.user.id;
    }
    
    const post = await Post.create(body);
    
    return NextResponse.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 400 }
    );
  }
}