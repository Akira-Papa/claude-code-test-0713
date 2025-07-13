// MongooseライブラリをインポートしてMongoDBとやり取りできるようにする
import mongoose from 'mongoose';

// 環境変数からMongoDB接続URL取得、なければローカルホストのデフォルトURLを使用
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/board';

// MongoDB URLが設定されていない場合はエラーを投げる
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// グローバル変数からキャッシュされた接続情報を取得
let cached = global.mongoose;

// キャッシュが存在しない場合は初期化（初回アクセス時）
if (!cached) {
  // グローバル変数にconnection（接続）とpromise（接続処理）を保存する場所を作る
  cached = global.mongoose = { conn: null, promise: null };
}

// データベース接続を管理する非同期関数
async function dbConnect() {
  // すでに接続が確立されている場合は、その接続を再利用
  if (cached.conn) {
    return cached.conn;
  }

  // 接続処理がまだ開始されていない場合
  if (!cached.promise) {
    // Mongooseの接続オプション設定
    const opts = {
      // コマンドのバッファリングを無効化（接続前にクエリを送らない）
      bufferCommands: false,
    };

    // MongoDBへの接続を開始し、接続が完了したらconnectionオブジェクトを返す
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      // 接続完了後、mongoose.connectionオブジェクトを返す
      return mongoose.connection;
    });
  }

  // 接続処理の完了を待つ
  try {
    // Promise（接続処理）が完了するまで待機し、結果をキャッシュに保存
    cached.conn = await cached.promise;
  } catch (e) {
    // エラーが発生した場合はPromiseをリセット（次回再試行できるように）
    cached.promise = null;
    // エラーを上位に伝播
    throw e;
  }

  // 確立された接続を返す
  return cached.conn;
}

// この関数を他のファイルから使えるようにエクスポート
export default dbConnect;