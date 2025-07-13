import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// 個別の投稿を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await dbConnect();
    
    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 400 }
    );
  }
}

// 投稿を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await dbConnect();
    
    const body = await request.json();
    const post = await Post.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 400 }
    );
  }
}

// 投稿を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await dbConnect();
    
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 400 }
    );
  }
}