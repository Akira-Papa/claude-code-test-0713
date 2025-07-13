# Claude Code Test Project - 掲示板アプリケーション

## プロジェクト概要

このプロジェクトは、Next.js 15 (App Router) + Material-UI + MongoDB を使用したシンプルな掲示板アプリケーションです。

## 技術スタック

- **フロントエンド**: Next.js 15.3.3, React 19.0.0, Material-UI 7.2.0
- **バックエンド**: Next.js API Routes (App Router)
- **データベース**: MongoDB 6.17.0, Mongoose 8.16.3
- **言語**: TypeScript 5.x
- **スタイリング**: Material-UI + Emotion
- **日付処理**: date-fns 4.1.0

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/posts/         # APIエンドポイント (GET/POST)
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ（掲示板UI）
│   ├── providers.tsx      # MUIテーマプロバイダー
│   └── theme.ts           # MUIカスタムテーマ
├── components/
│   ├── PostForm.tsx       # 投稿作成フォーム
│   └── PostList.tsx       # 投稿一覧表示
├── lib/
│   └── mongodb.ts         # MongoDB接続管理
└── models/
    └── Post.ts            # Mongooseモデル定義
```

## 主要機能

1. **投稿機能**
   - 名前、タイトル、本文、カテゴリーを入力して投稿
   - バリデーション付き（文字数制限）

2. **投稿一覧表示**
   - カテゴリー別タブ表示（すべて/質問/雑談/その他）
   - 日時フォーマット表示
   - 最新投稿が上部に表示

3. **API エンドポイント**
   - `GET /api/posts`: 投稿一覧取得（カテゴリーフィルタ対応）
   - `POST /api/posts`: 新規投稿作成

## データモデル

### Post スキーマ
```typescript
{
  name: string (required, max: 50)
  title: string (required, max: 100)
  content: string (required, max: 1000)
  category: '質問' | '雑談' | 'その他'
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# Lintチェック
npm run lint

# テスト実行（Jestセットアップ後）
npm test

# E2Eテスト実行（Playwrightセットアップ後）
npm run test:e2e
```

## 環境変数

```env
MONGODB_URI=mongodb://localhost:27017/board
```

## テスト戦略

### ユニットテスト (Jest)
- コンポーネントテスト（PostForm, PostList）
- APIルートテスト
- ユーティリティ関数テスト
- モデルバリデーションテスト

### E2Eテスト (Playwright)
- 投稿の作成フロー
- カテゴリーフィルタリング
- エラーハンドリング
- レスポンシブ表示

## 開発時の注意事項

1. **MongoDB接続**
   - ローカル環境では MongoDB が起動している必要があります
   - 接続文字列は環境変数で管理してください

2. **型安全性**
   - TypeScript の strict mode が有効です
   - 型定義を適切に行ってください

3. **コード品質**
   - ESLint の警告を解消してください
   - テストカバレッジを維持してください

## 今後の改善案

1. **機能追加**
   - ユーザー認証機能
   - 投稿の編集・削除機能
   - ページネーション
   - 検索機能
   - リアルタイム更新（WebSocket）

2. **技術的改善**
   - データフェッチングライブラリ（SWR/TanStack Query）導入
   - エラーバウンダリの実装
   - ローディング状態の改善
   - キャッシュ戦略の実装
   - Prettier設定の追加

3. **パフォーマンス最適化**
   - 画像最適化（next/image使用）
   - バンドルサイズ削減
   - Server Components の活用
   - データベースインデックスの最適化

## デバッグのヒント

1. **MongoDB接続エラー**
   - MongoDB が起動しているか確認
   - 接続文字列が正しいか確認
   - ネットワーク設定を確認

2. **APIエラー**
   - ブラウザの開発者ツールでネットワークタブを確認
   - Next.js のコンソールログを確認
   - レスポンスのステータスコードとメッセージを確認

3. **TypeScriptエラー**
   - VSCodeの問題タブを確認
   - `npm run lint` でエラーを確認
   - 型定義が正しくインポートされているか確認

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)