# API設計書 - シンプル掲示板アプリ

## 1. API概要

### ベースURL
```
http://localhost:3000/api
```

### 共通仕様
- **プロトコル**: HTTP/HTTPS
- **データ形式**: JSON
- **文字コード**: UTF-8
- **認証**: なし（パブリックAPI）
- **エラーレスポンス形式**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {} // オプション
  }
}
```

## 2. エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/posts` | 投稿一覧取得 |
| GET | `/posts/[id]` | 投稿詳細取得 |
| POST | `/posts` | 新規投稿作成 |
| PUT | `/posts/[id]` | 投稿更新 |
| DELETE | `/posts/[id]` | 投稿削除 |
| POST | `/posts/[id]/verify` | 投稿のパスワード検証 |
| GET | `/categories` | カテゴリー一覧取得 |
| GET | `/posts/category/[slug]` | カテゴリー別投稿一覧 |

## 3. API詳細

### 3.1 投稿一覧取得

#### エンドポイント
```
GET /api/posts
```

#### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|-----------|
| page | number | × | ページ番号（1から開始） | 1 |
| limit | number | × | 1ページあたりの件数 | 10 |
| sort | string | × | ソート順（createdAt_desc, createdAt_asc） | createdAt_desc |

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "投稿者名",
        "title": "投稿タイトル",
        "content": "投稿本文",
        "category": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "雑談",
          "slug": "general"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### エラーレスポンス
- **400 Bad Request**: 不正なパラメータ
- **500 Internal Server Error**: サーバーエラー

### 3.2 投稿詳細取得

#### エンドポイント
```
GET /api/posts/[id]
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ○ | 投稿ID（MongoDB ObjectId） |

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "投稿者名",
    "title": "投稿タイトル",
    "content": "投稿本文の全文",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "雑談",
      "slug": "general"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "relatedPosts": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "関連投稿タイトル",
        "createdAt": "2024-01-14T10:30:00.000Z"
      }
    ]
  }
}
```

#### エラーレスポンス
- **404 Not Found**: 投稿が見つからない
- **500 Internal Server Error**: サーバーエラー

### 3.3 新規投稿作成

#### エンドポイント
```
POST /api/posts
```

#### リクエストボディ
```typescript
{
  "name": "投稿者名",
  "title": "投稿タイトル",
  "content": "投稿本文",
  "categoryId": "507f1f77bcf86cd799439012",
  "password": "editPassword123"
}
```

#### バリデーション
| フィールド | ルール |
|-----------|--------|
| name | 必須、1-50文字 |
| title | 必須、1-100文字 |
| content | 必須、1-1000文字 |
| categoryId | 必須、有効なObjectId |
| password | 必須、4-20文字 |

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "投稿者名",
    "title": "投稿タイトル",
    "content": "投稿本文",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "雑談",
      "slug": "general"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### エラーレスポンス
- **400 Bad Request**: バリデーションエラー
- **404 Not Found**: カテゴリーが見つからない
- **500 Internal Server Error**: サーバーエラー

### 3.4 カテゴリー一覧取得

#### エンドポイント
```
GET /api/categories
```

#### レスポンス
```typescript
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "雑談",
      "slug": "general",
      "description": "自由な話題で交流しましょう",
      "postCount": 150
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "質問",
      "slug": "questions",
      "description": "わからないことを質問しよう",
      "postCount": 89
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "お知らせ",
      "slug": "announcements",
      "description": "重要なお知らせ",
      "postCount": 23
    }
  ]
}
```

#### エラーレスポンス
- **500 Internal Server Error**: サーバーエラー

### 3.5 カテゴリー別投稿一覧

#### エンドポイント
```
GET /api/posts/category/[slug]
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| slug | string | ○ | カテゴリーのスラッグ |

#### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|-----------|
| page | number | × | ページ番号（1から開始） | 1 |
| limit | number | × | 1ページあたりの件数 | 10 |

#### レスポンス
投稿一覧取得と同じ形式

#### エラーレスポンス
- **404 Not Found**: カテゴリーが見つからない
- **500 Internal Server Error**: サーバーエラー

### 3.6 投稿更新

#### エンドポイント
```
PUT /api/posts/[id]
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ○ | 投稿ID（MongoDB ObjectId） |

#### リクエストボディ
```typescript
{
  "name": "投稿者名",
  "title": "投稿タイトル",
  "content": "投稿本文",
  "categoryId": "507f1f77bcf86cd799439012",
  "password": "editPassword123"
}
```

#### バリデーション
| フィールド | ルール |
|-----------|--------|
| name | 必須、1-50文字 |
| title | 必須、1-100文字 |
| content | 必須、1-1000文字 |
| categoryId | 必須、有効なObjectId |
| password | 必須、正しいパスワード |

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "投稿者名",
    "title": "更新後のタイトル",
    "content": "更新後の本文",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "雑談",
      "slug": "general"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

#### エラーレスポンス
- **400 Bad Request**: バリデーションエラー
- **401 Unauthorized**: パスワードが一致しない
- **404 Not Found**: 投稿が見つからない
- **500 Internal Server Error**: サーバーエラー

### 3.7 投稿削除

#### エンドポイント
```
DELETE /api/posts/[id]
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ○ | 投稿ID（MongoDB ObjectId） |

#### リクエストボディ
```typescript
{
  "password": "editPassword123"
}
```

#### バリデーション
| フィールド | ルール |
|-----------|--------|
| password | 必須、正しいパスワード |

#### レスポンス
```typescript
{
  "success": true,
  "message": "投稿を削除しました"
}
```

#### エラーレスポンス
- **401 Unauthorized**: パスワードが一致しない
- **404 Not Found**: 投稿が見つからない
- **500 Internal Server Error**: サーバーエラー

### 3.8 パスワード検証

#### エンドポイント
```
POST /api/posts/[id]/verify
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ○ | 投稿ID（MongoDB ObjectId） |

#### リクエストボディ
```typescript
{
  "password": "editPassword123"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "valid": true
}
```

#### エラーレスポンス
- **404 Not Found**: 投稿が見つからない
- **500 Internal Server Error**: サーバーエラー

## 4. 認証関連API

### 4.1 ユーザー登録

#### エンドポイント
```
POST /api/auth/register
```

#### リクエストボディ
```typescript
{
  "username": "user123",
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "message": "認証コードをメールで送信しました"
}
```

### 4.2 メール認証

#### エンドポイント
```
POST /api/auth/verify-email
```

#### リクエストボディ
```typescript
{
  "email": "user@example.com",
  "code": "123456"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "user123",
      "email": "user@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

### 4.3 ログイン

#### エンドポイント
```
POST /api/auth/signin
```

#### リクエストボディ
```typescript
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "user123",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "jwt-token-here"
  }
}
```

### 4.4 パスワードリセット申請

#### エンドポイント
```
POST /api/auth/forgot-password
```

#### リクエストボディ
```typescript
{
  "email": "user@example.com"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "message": "パスワードリセットリンクをメールで送信しました"
}
```

### 4.5 パスワードリセット

#### エンドポイント
```
POST /api/auth/reset-password
```

#### リクエストボディ
```typescript
{
  "token": "reset-token",
  "password": "NewPassword123!"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "message": "パスワードを更新しました"
}
```

### 4.6 プロフィール取得

#### エンドポイント
```
GET /api/auth/profile
```

#### ヘッダー
```
Authorization: Bearer jwt-token-here
```

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "user123",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "自己紹介文",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "postCount": 42
  }
}
```

### 4.7 プロフィール更新

#### エンドポイント
```
PUT /api/auth/profile
```

#### ヘッダー
```
Authorization: Bearer jwt-token-here
```

#### リクエストボディ
```typescript
{
  "username": "newusername",
  "bio": "新しい自己紹介",
  "avatar": "base64-image-data" // オプション
}
```

#### レスポンス
```typescript
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "newusername",
    "email": "user@example.com",
    "avatar": "https://example.com/new-avatar.jpg",
    "bio": "新しい自己紹介"
  }
}
```

### 4.8 認証コード再送信

#### エンドポイント
```
POST /api/auth/resend-code
```

#### リクエストボディ
```typescript
{
  "email": "user@example.com"
}
```

#### レスポンス
```typescript
{
  "success": true,
  "message": "認証コードを再送信しました"
}
```

## 5. エラーコード一覧

| コード | 説明 |
|--------|------|
| VALIDATION_ERROR | バリデーションエラー |
| NOT_FOUND | リソースが見つからない |
| INTERNAL_ERROR | 内部エラー |
| DATABASE_ERROR | データベースエラー |
| INVALID_PARAMETER | 不正なパラメータ |
| UNAUTHORIZED | 認証エラー（パスワード不一致） |
| UNAUTHENTICATED | 未認証（トークンなし/無効） |
| EMAIL_ALREADY_EXISTS | メールアドレス重複 |
| USERNAME_ALREADY_EXISTS | ユーザー名重複 |
| INVALID_VERIFICATION_CODE | 認証コード不正 |
| EXPIRED_TOKEN | トークン期限切れ |

## 6. レート制限

現時点では実装なし。将来的に以下を検討：
- IPアドレスごとに1分間に60リクエストまで
- 投稿作成は1分間に5回まで
- 認証関連APIは1分間に10回まで

## 7. キャッシュ戦略

- **投稿一覧**: 1分間キャッシュ
- **カテゴリー一覧**: 5分間キャッシュ
- **投稿詳細**: キャッシュなし（リアルタイム性重視）
- **ユーザープロフィール**: 5分間キャッシュ

## 8. Next.js App Router実装例

### Route Handler実装例（app/api/posts/route.ts）
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    const posts = await Post.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Post.countDocuments()
    
    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    // バリデーション処理
    // 投稿作成処理
    
    return NextResponse.json({
      success: true,
      data: newPost
    }, { status: 201 })
  } catch (error) {
    // エラーハンドリング
  }
}
```