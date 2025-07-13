# 環境変数一覧 - シンプル掲示板アプリ

## 必須環境変数

### データベース関連
```bash
# MongoDB接続文字列
MONGODB_URI=mongodb://localhost:27017/simple-board
# または MongoDB Atlas の場合
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/simple-board?retryWrites=true&w=majority
```

### NextAuth.js関連
```bash
# NextAuth.js シークレット（ランダムな文字列を生成）
# 生成方法: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# NextAuth.js URL（本番環境では実際のURLに変更）
NEXTAUTH_URL=http://localhost:3000

# NextAuth.js URL（本番環境用）
# NEXTAUTH_URL=https://your-domain.com
```

### メール送信関連（SMTP設定）
```bash
# SMTPサーバー設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com

# またはSendGrid等のサービスを使用する場合
# SENDGRID_API_KEY=your-sendgrid-api-key
# EMAIL_FROM=noreply@your-domain.com
```

### Google OAuth（オプション）
```bash
# Google OAuth認証を使用する場合
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### アプリケーション設定
```bash
# 環境設定
NODE_ENV=development # production, development, test

# アプリケーションURL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# APIベースURL（クライアント側で使用）
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### セキュリティ関連
```bash
# JWT設定
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# 認証コードの有効期限（分）
VERIFICATION_CODE_EXPIRES_IN=10

# パスワードリセットトークンの有効期限（時間）
PASSWORD_RESET_EXPIRES_IN=1
```

### 画像アップロード関連（オプション）
```bash
# Cloudinary設定（アバター画像用）
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# またはAWS S3を使用する場合
# AWS_REGION=ap-northeast-1
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET=your-bucket-name
```

## 開発環境用 .env.local の例

```bash
# データベース
MONGODB_URI=mongodb://localhost:27017/simple-board-dev

# NextAuth.js
NEXTAUTH_SECRET=development-secret-key-12345678
NEXTAUTH_URL=http://localhost:3000

# メール（開発環境では Ethereal Email を推奨）
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass
SMTP_FROM=noreply@localhost

# アプリケーション
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# セキュリティ
JWT_SECRET=dev-jwt-secret
JWT_EXPIRES_IN=7d
VERIFICATION_CODE_EXPIRES_IN=10
PASSWORD_RESET_EXPIRES_IN=1
```

## 本番環境用環境変数の例

```bash
# データベース
MONGODB_URI=mongodb+srv://produser:prodpass@cluster.mongodb.net/simple-board?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_SECRET=<32文字以上のランダムな文字列>
NEXTAUTH_URL=https://your-domain.com

# メール（SendGrid使用例）
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx

# アプリケーション
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# セキュリティ
JWT_SECRET=<32文字以上のランダムな文字列>
JWT_EXPIRES_IN=7d
VERIFICATION_CODE_EXPIRES_IN=10
PASSWORD_RESET_EXPIRES_IN=1

# 画像アップロード（Cloudinary）
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
```

## 環境変数の設定方法

### 1. ローカル開発環境
プロジェクトルートに `.env.local` ファイルを作成し、上記の環境変数を設定します。

```bash
# .env.local ファイルを作成
touch .env.local

# .gitignore に追加されていることを確認
echo ".env.local" >> .gitignore
```

### 2. Vercel でのデプロイ
1. Vercel ダッシュボードにログイン
2. プロジェクトの Settings → Environment Variables
3. 各環境変数を追加（Production, Preview, Development）

### 3. 環境変数の生成

#### NEXTAUTH_SECRET の生成
```bash
openssl rand -base64 32
```

#### JWT_SECRET の生成
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. メールサービスの設定

#### Gmail を使用する場合
1. Googleアカウントの2段階認証を有効化
2. アプリパスワードを生成
3. SMTP_PASS にアプリパスワードを設定

#### Ethereal Email（開発用）
1. https://ethereal.email にアクセス
2. Create Ethereal Account
3. 生成された認証情報を環境変数に設定

#### SendGrid を使用する場合
1. SendGrid アカウントを作成
2. API Key を生成（Full Access）
3. Sender Authentication を設定

## セキュリティに関する注意事項

1. **環境変数ファイルの管理**
   - `.env.local` は絶対にGitにコミットしない
   - 本番環境の環境変数は安全に管理する

2. **シークレットキーの強度**
   - NEXTAUTH_SECRET、JWT_SECRET は32文字以上のランダムな文字列を使用
   - 定期的に更新することを推奨

3. **アクセス権限**
   - データベースのユーザーは必要最小限の権限のみ付与
   - APIキーは必要なスコープのみ有効化

4. **HTTPS の使用**
   - 本番環境では必ず HTTPS を使用
   - NEXTAUTH_URL は HTTPS の URL を設定