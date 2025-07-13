# データベース設計書 - シンプル掲示板アプリ

## 1. データベース概要

### 使用技術
- **データベース**: MongoDB
- **ODM**: Mongoose
- **接続方式**: MongoDB Atlas または ローカルMongoDB

### 接続設定
```typescript
// .env.local
MONGODB_URI=mongodb://localhost:27017/simple-board
// または
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/simple-board
```

## 2. コレクション一覧

| コレクション名 | 説明 | 主な用途 |
|---------------|------|----------|
| posts | 投稿データ | 掲示板の投稿を保存 |
| categories | カテゴリーマスタ | 投稿のカテゴリー分類 |
| users | ユーザーデータ | 登録ユーザー情報を保存 |
| verificationTokens | 認証トークン | メール認証・パスワードリセット用 |
| sessions | セッション | NextAuth.jsセッション管理 |

## 3. スキーマ定義

### 3.1 Posts コレクション

#### スキーマ定義
```typescript
// models/Post.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  name: string
  title: string
  content: string
  category: mongoose.Types.ObjectId
  password?: string // ログインユーザーの場合は不要
  author?: mongoose.Types.ObjectId // ログインユーザーの場合
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    name: {
      type: String,
      required: [true, '名前は必須です'],
      trim: true,
      maxlength: [50, '名前は50文字以内で入力してください']
    },
    title: {
      type: String,
      required: [true, 'タイトルは必須です'],
      trim: true,
      maxlength: [100, 'タイトルは100文字以内で入力してください']
    },
    content: {
      type: String,
      required: [true, '本文は必須です'],
      maxlength: [1000, '本文は1000文字以内で入力してください']
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'カテゴリーは必須です']
    },
    password: {
      type: String,
      required: function() { return !this.author }, // authorがない場合は必須
      minlength: [4, 'パスワードは4文字以上で入力してください'],
      maxlength: [20, 'パスワードは20文字以内で入力してください'],
      select: false // デフォルトではパスワードを返さない
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function() { return !this.password } // passwordがない場合は必須
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// インデックス
PostSchema.index({ createdAt: -1 })
PostSchema.index({ category: 1, createdAt: -1 })
PostSchema.index({ title: 'text', content: 'text' }) // 全文検索用
PostSchema.index({ isDeleted: 1 }) // 削除フラグでのフィルタリング用

// パスワードのハッシュ化
PostSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const bcrypt = require('bcrypt')
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// パスワード検証メソッド
PostSchema.methods.verifyPassword = async function(candidatePassword: string) {
  const bcrypt = require('bcrypt')
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
```

#### フィールド詳細
| フィールド名 | 型 | 必須 | 説明 | 制約 |
|-------------|-----|------|------|------|
| _id | ObjectId | ○ | 自動生成されるID | - |
| name | String | △ | 投稿者名（未ログイン時） | 最大50文字、前後の空白除去 |
| title | String | ○ | 投稿タイトル | 最大100文字、前後の空白除去 |
| content | String | ○ | 投稿本文 | 最大1000文字 |
| category | ObjectId | ○ | カテゴリーへの参照 | Categoryコレクションの_id |
| password | String | △ | 編集用パスワード（未ログイン時） | 4-20文字、bcryptでハッシュ化 |
| author | ObjectId | △ | 投稿者（ログイン時） | Userコレクションの_id |
| isDeleted | Boolean | ○ | 論理削除フラグ | デフォルト: false |
| createdAt | Date | ○ | 作成日時 | 自動設定 |
| updatedAt | Date | ○ | 更新日時 | 自動設定 |

### 3.2 Categories コレクション

#### スキーマ定義
```typescript
// models/Category.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'カテゴリー名は必須です'],
      unique: true,
      trim: true,
      maxlength: [50, 'カテゴリー名は50文字以内で入力してください']
    },
    slug: {
      type: String,
      required: [true, 'スラッグは必須です'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'スラッグは英小文字、数字、ハイフンのみ使用可能です']
    },
    description: {
      type: String,
      maxlength: [200, '説明は200文字以内で入力してください']
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// インデックス
CategorySchema.index({ slug: 1 })
CategorySchema.index({ order: 1 })

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
```

#### フィールド詳細
| フィールド名 | 型 | 必須 | 説明 | 制約 |
|-------------|-----|------|------|------|
| _id | ObjectId | ○ | 自動生成されるID | - |
| name | String | ○ | カテゴリー名 | 最大50文字、ユニーク |
| slug | String | ○ | URLスラッグ | 英小文字・数字・ハイフンのみ、ユニーク |
| description | String | × | カテゴリーの説明 | 最大200文字 |
| order | Number | ○ | 表示順序 | デフォルト: 0 |
| isActive | Boolean | ○ | 有効フラグ | デフォルト: true |
| createdAt | Date | ○ | 作成日時 | 自動設定 |
| updatedAt | Date | ○ | 更新日時 | 自動設定 |

### 3.3 Users コレクション

#### スキーマ定義
```typescript
// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  avatar?: string
  bio?: string
  emailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'ユーザー名は必須です'],
      unique: true,
      trim: true,
      minlength: [3, 'ユーザー名は3文字以上で入力してください'],
      maxlength: [20, 'ユーザー名は20文字以内で入力してください'],
      match: [/^[a-zA-Z0-9_]+$/, 'ユーザー名は英数字とアンダースコアのみ使用可能です']
    },
    email: {
      type: String,
      required: [true, 'メールアドレスは必須です'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '有効なメールアドレスを入力してください']
    },
    password: {
      type: String,
      required: [true, 'パスワードは必須です'],
      minlength: [8, 'パスワードは8文字以上で入力してください'],
      select: false
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, '自己紹介は500文字以内で入力してください'],
      default: ''
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// インデックス
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })

// パスワードのハッシュ化
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const bcrypt = require('bcrypt')
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// パスワード検証メソッド
UserSchema.methods.verifyPassword = async function(candidatePassword: string) {
  const bcrypt = require('bcrypt')
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
```

#### フィールド詳細
| フィールド名 | 型 | 必須 | 説明 | 制約 |
|-------------|-----|------|------|------|
| _id | ObjectId | ○ | 自動生成されるID | - |
| username | String | ○ | ユーザー名 | 3-20文字、英数字とアンダースコア、ユニーク |
| email | String | ○ | メールアドレス | メール形式、ユニーク |
| password | String | ○ | パスワード（ハッシュ化） | 8文字以上、bcryptでハッシュ化 |
| avatar | String | × | アバター画像URL | - |
| bio | String | × | 自己紹介 | 最大500文字 |
| emailVerified | Boolean | ○ | メール認証済みフラグ | デフォルト: false |
| isActive | Boolean | ○ | アカウント有効フラグ | デフォルト: true |
| createdAt | Date | ○ | 作成日時 | 自動設定 |
| updatedAt | Date | ○ | 更新日時 | 自動設定 |

### 3.4 VerificationTokens コレクション

#### スキーマ定義
```typescript
// models/VerificationToken.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IVerificationToken extends Document {
  email: string
  token: string
  type: 'email' | 'password-reset'
  code?: string // 6桁の認証コード
  expiresAt: Date
  createdAt: Date
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: ['email', 'password-reset']
    },
    code: {
      type: String,
      minlength: 6,
      maxlength: 6
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

// インデックス
VerificationTokenSchema.index({ email: 1, type: 1 })
VerificationTokenSchema.index({ token: 1 })
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTLインデックス

export default mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema)
```

#### フィールド詳細
| フィールド名 | 型 | 必須 | 説明 | 制約 |
|-------------|-----|------|------|------|
| _id | ObjectId | ○ | 自動生成されるID | - |
| email | String | ○ | 対象メールアドレス | - |
| token | String | ○ | トークン（URL用） | ユニーク |
| type | String | ○ | トークンタイプ | 'email' または 'password-reset' |
| code | String | × | 6桁の認証コード | メール認証用 |
| expiresAt | Date | ○ | 有効期限 | デフォルト: 24時間後 |
| createdAt | Date | ○ | 作成日時 | 自動設定 |

## 4. 初期データ

### カテゴリー初期データ
```javascript
// scripts/seed-categories.js
const categories = [
  {
    name: '雑談',
    slug: 'general',
    description: '自由な話題で交流しましょう',
    order: 1
  },
  {
    name: '質問',
    slug: 'questions',
    description: 'わからないことを質問しよう',
    order: 2
  },
  {
    name: 'お知らせ',
    slug: 'announcements',
    description: '重要なお知らせ',
    order: 3
  },
  {
    name: '技術',
    slug: 'tech',
    description: '技術的な話題',
    order: 4
  },
  {
    name: '趣味',
    slug: 'hobbies',
    description: '趣味の話題で盛り上がろう',
    order: 5
  }
]
```

## 5. データベース接続

### 接続ユーティリティ
```typescript
// lib/mongodb.ts
import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
```

## 6. クエリパターン

### 6.1 投稿の取得
```typescript
// 最新の投稿10件を取得（カテゴリー情報含む、削除されていないもののみ）
const posts = await Post.find({ isDeleted: false })
  .populate('category', 'name slug')
  .sort({ createdAt: -1 })
  .limit(10)
  .lean()

// 特定カテゴリーの投稿を取得（削除されていないもののみ）
const categoryPosts = await Post.find({ 
  category: categoryId,
  isDeleted: false 
})
  .populate('category', 'name slug')
  .sort({ createdAt: -1 })
  .limit(10)
  .lean()

// 関連投稿を取得（同じカテゴリーの最新3件、削除されていないもののみ）
const relatedPosts = await Post.find({
  category: post.category,
  _id: { $ne: post._id },
  isDeleted: false
})
  .select('title createdAt')
  .sort({ createdAt: -1 })
  .limit(3)
  .lean()

// 投稿の更新（パスワード検証付き）
const post = await Post.findById(postId).select('+password')
if (!post || post.isDeleted) {
  throw new Error('投稿が見つかりません')
}

const isValidPassword = await post.verifyPassword(inputPassword)
if (!isValidPassword) {
  throw new Error('パスワードが一致しません')
}

// 投稿を更新
post.title = newTitle
post.content = newContent
await post.save()

// 投稿の論理削除
const post = await Post.findById(postId).select('+password')
if (!post || post.isDeleted) {
  throw new Error('投稿が見つかりません')
}

const isValidPassword = await post.verifyPassword(inputPassword)
if (!isValidPassword) {
  throw new Error('パスワードが一致しません')
}

post.isDeleted = true
await post.save()
```

### 6.2 集計クエリ
```typescript
// カテゴリーごとの投稿数を取得（削除されていないもののみ）
const postCounts = await Post.aggregate([
  {
    $match: { isDeleted: false }
  },
  {
    $group: {
      _id: '$category',
      count: { $sum: 1 }
    }
  }
])

// カテゴリー情報と投稿数を結合
const categoriesWithCount = await Category.aggregate([
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'category',
      as: 'posts'
    }
  },
  {
    $project: {
      name: 1,
      slug: 1,
      description: 1,
      order: 1,
      postCount: { $size: '$posts' }
    }
  },
  {
    $sort: { order: 1 }
  }
])
```

## 7. パフォーマンス最適化

### インデックス戦略
1. **posts.createdAt**: 新着順ソート用
2. **posts.category + createdAt**: カテゴリー別一覧用の複合インデックス
3. **posts.title + content**: 全文検索用のテキストインデックス
4. **posts.isDeleted**: 削除フラグでのフィルタリング用
5. **categories.slug**: URLアクセス用
6. **categories.order**: 表示順序ソート用

### クエリ最適化
- `lean()`: Mongooseドキュメントではなくプレーンオブジェクトを返す
- `select()`: 必要なフィールドのみ取得
- `populate()`: 必要な関連データのみ取得

## 8. バックアップとメンテナンス

### バックアップ戦略
- **頻度**: 日次バックアップ
- **保持期間**: 7日間
- **方法**: MongoDB Atlasの自動バックアップまたはmongodump

### メンテナンスタスク
1. 古い投稿のアーカイブ（6ヶ月以上前）
2. インデックスの再構築（月次）
3. ディスク容量の監視

## 9. セキュリティ考慮事項

1. **接続文字列の保護**: 環境変数で管理
2. **入力値検証**: Mongooseスキーマでバリデーション
3. **インジェクション対策**: Mongooseの使用により自動的に対策
4. **アクセス制限**: MongoDB Atlasのネットワークアクセス制限
5. **パスワード保護**: bcryptによるハッシュ化、selectオプションでデフォルト非表示
6. **論理削除**: 物理削除ではなく論理削除で誤削除を防止

## 10. 今後の拡張案

1. **ユーザーコレクション**: 認証機能追加時
2. **いいね機能**: 投稿への反応機能
3. **タグ機能**: より細かい分類
4. **画像アップロード**: GridFSまたはS3連携
5. **検索履歴**: ユーザーの検索履歴保存