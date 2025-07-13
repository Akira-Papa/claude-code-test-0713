# 掲示板アプリケーション

Next.js 14、Material UI、MongoDBを使用したシンプルな掲示板アプリケーションです。

## 機能

- 投稿フォーム（名前、タイトル、本文）
- 投稿一覧表示（新着順）
- カテゴリー分類（一般、テクノロジー、ビジネス、ライフスタイル、その他）
- レスポンシブデザイン

## セットアップ

1. MongoDBのインストールと起動（ローカル環境の場合）
   ```bash
   # macOSの場合
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. 環境変数の設定
   ```bash
   cp .env.local.example .env.local
   # .env.localファイルを編集してMongoDB接続URLを設定
   ```

3. 依存関係のインストール
   ```bash
   npm install
   ```

4. 開発サーバーの起動
   ```bash
   npm run dev
   ```

5. ブラウザで http://localhost:3000 を開く

## MongoDB Atlas（クラウド版）を使用する場合

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)でアカウントを作成
2. クラスターを作成
3. 接続文字列を取得
4. `.env.local`ファイルに接続文字列を設定

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)、TypeScript
- **UIライブラリ**: Material UI (MUI)
- **データベース**: MongoDB
- **ODM**: Mongoose