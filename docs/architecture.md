# システム構成図 - シンプル掲示板アプリ

## 1. システム全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                         ユーザー                              │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Webブラウザ                                │
│                 (Chrome, Firefox, Safari等)                   │
└─────────────────────────────────────────────────────────────┘
                                │
                            HTTPS
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Vercel / Next.js                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  フロントエンド                        │   │
│  │  ・React Components (MUI)                            │   │
│  │  ・Client-side Routing                              │   │
│  │  ・State Management                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  バックエンド                         │   │
│  │  ・API Routes (App Router)                          │   │
│  │  ・Server Components                                │   │
│  │  ・Mongoose ODM                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
                          MongoDB接続
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        MongoDB                               │
│              (MongoDB Atlas / Local MongoDB)                 │
│  ・posts collection                                         │
│  ・categories collection                                    │
└─────────────────────────────────────────────────────────────┘
```

## 2. ディレクトリ構造

```
simple-board/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # トップページ
│   ├── globals.css            # グローバルCSS
│   ├── providers.tsx          # MUIテーマプロバイダー
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx       # 投稿詳細ページ
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx       # カテゴリー別一覧
│   └── api/                   # APIルート
│       ├── posts/
│       │   ├── route.ts       # GET(一覧), POST(作成)
│       │   └── [id]/
│       │       └── route.ts   # GET(詳細)
│       ├── categories/
│       │   └── route.ts       # GET(一覧)
│       └── posts/
│           └── category/
│               └── [slug]/
│                   └── route.ts # GET(カテゴリー別)
├── components/                 # 共通コンポーネント
│   ├── layout/
│   │   ├── Header.tsx         # ヘッダー
│   │   └── Footer.tsx         # フッター
│   ├── post/
│   │   ├── PostForm.tsx       # 投稿フォーム
│   │   ├── PostList.tsx       # 投稿一覧
│   │   └── PostCard.tsx       # 投稿カード
│   └── common/
│       ├── Loading.tsx        # ローディング
│       └── ErrorAlert.tsx     # エラー表示
├── lib/                        # ライブラリ・ユーティリティ
│   ├── mongodb.ts             # MongoDB接続
│   ├── validators.ts          # バリデーション
│   └── constants.ts           # 定数定義
├── models/                     # Mongooseモデル
│   ├── Post.ts                # 投稿モデル
│   └── Category.ts            # カテゴリーモデル
├── types/                      # TypeScript型定義
│   ├── post.ts                # 投稿関連の型
│   └── category.ts            # カテゴリー関連の型
├── hooks/                      # カスタムフック
│   ├── usePosts.ts            # 投稿データ取得
│   └── useCategories.ts       # カテゴリーデータ取得
├── styles/                     # スタイル関連
│   └── theme.ts               # MUIテーマ設定
├── public/                     # 静的ファイル
├── docs/                       # ドキュメント
│   ├── screens.md             # 画面設計書
│   ├── api.md                 # API設計書
│   ├── database.md            # データベース設計書
│   └── architecture.md        # システム構成図
├── .env.local                  # 環境変数
├── .gitignore                  # Git除外設定
├── package.json                # パッケージ定義
├── tsconfig.json              # TypeScript設定
├── next.config.js             # Next.js設定
└── README.md                  # プロジェクト説明
```

## 3. 技術スタック詳細

### フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 14.x | フレームワーク（App Router） |
| React | 18.x | UIライブラリ |
| TypeScript | 5.x | 型安全な開発 |
| Material-UI | 5.x | UIコンポーネント |
| Axios | 1.x | HTTPクライアント |
| SWR | 2.x | データフェッチング |

### バックエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js API Routes | 14.x | APIエンドポイント |
| Mongoose | 8.x | MongoDB ODM |
| Zod | 3.x | スキーマバリデーション |

### データベース
| 技術 | バージョン | 用途 |
|------|-----------|------|
| MongoDB | 7.x | ドキュメントDB |
| MongoDB Atlas | - | クラウドDB（本番環境） |

### 開発ツール
| 技術 | 用途 |
|------|------|
| ESLint | コード品質管理 |
| Prettier | コードフォーマット |
| Git | バージョン管理 |

## 4. データフロー

### 4.1 投稿作成フロー
```
1. ユーザーが投稿フォームに入力
    ↓
2. クライアント側バリデーション（React Hook Form）
    ↓
3. POST /api/posts リクエスト送信
    ↓
4. サーバー側バリデーション（Zod）
    ↓
5. MongoDBに保存（Mongoose）
    ↓
6. レスポンス返却
    ↓
7. SWRキャッシュ更新
    ↓
8. UI更新（投稿一覧に反映）
```

### 4.2 投稿取得フロー
```
1. ページロード or ルート変更
    ↓
2. SWRでデータフェッチング
    ↓
3. キャッシュ確認
    ↓ (キャッシュなし)
4. GET /api/posts リクエスト
    ↓
5. MongoDBからデータ取得
    ↓
6. レスポンス返却
    ↓
7. SWRキャッシュ保存
    ↓
8. UIレンダリング
```

## 5. セキュリティ設計

### 5.1 入力値検証
- **クライアント側**: React Hook Form + Zod
- **サーバー側**: Zod スキーマバリデーション
- **データベース側**: Mongoose スキーマバリデーション

### 5.2 XSS対策
- React の自動エスケープ機能
- dangerouslySetInnerHTML の不使用
- Content Security Policy ヘッダー設定

### 5.3 環境変数管理
```typescript
// 環境変数の例
MONGODB_URI=mongodb://localhost:27017/simple-board
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5.4 エラーハンドリング
- API: try-catch でエラーをキャッチし、適切なステータスコードを返却
- クライアント: Error Boundary でエラーをキャッチし、フォールバック UI を表示

## 6. パフォーマンス最適化

### 6.1 フロントエンド
- **コード分割**: Next.js の自動コード分割
- **画像最適化**: Next.js Image コンポーネント
- **キャッシュ**: SWR によるクライアントサイドキャッシュ
- **遅延読み込み**: React.lazy() と Suspense

### 6.2 バックエンド
- **データベース接続プーリング**: Mongoose の接続再利用
- **クエリ最適化**: lean() メソッドの使用
- **インデックス**: 適切なインデックスの設定

### 6.3 インフラ
- **CDN**: Vercel Edge Network
- **サーバーレス**: Vercel Functions
- **自動スケーリング**: Vercel の自動スケーリング

## 7. デプロイメント

### 7.1 開発環境
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# http://localhost:3000 でアクセス
```

### 7.2 本番環境（Vercel）
```bash
# ビルド
npm run build

# Vercelにデプロイ
vercel

# 環境変数設定
# Vercelダッシュボードで MONGODB_URI を設定
```

### 7.3 環境別設定
| 環境 | API URL | DB接続先 |
|------|---------|----------|
| 開発 | http://localhost:3000/api | ローカルMongoDB |
| ステージング | https://staging.example.com/api | MongoDB Atlas (staging) |
| 本番 | https://example.com/api | MongoDB Atlas (production) |

## 8. 監視・ログ

### 8.1 アプリケーション監視
- **Vercel Analytics**: パフォーマンス監視
- **Sentry**: エラー監視（オプション）

### 8.2 ログ管理
- **開発環境**: console.log
- **本番環境**: Vercel Functions ログ

## 9. 今後の拡張可能性

### 9.1 機能拡張
- ユーザー認証（NextAuth.js）
- リアルタイム更新（Socket.io）
- 画像アップロード（AWS S3）
- 検索機能（Elasticsearch）

### 9.2 インフラ拡張
- Redis によるキャッシュ層追加
- CDN による静的アセット配信
- ロードバランサーによる負荷分散

### 9.3 マイクロサービス化
- 投稿サービス
- カテゴリーサービス
- 通知サービス
- 検索サービス