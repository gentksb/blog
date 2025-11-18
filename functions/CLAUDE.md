# Cloudflare Workers + Static Assets 開発ガイド

## アーキテクチャ概要

このプロジェクトは**Cloudflare Workers + Static Assets**アーキテクチャを使用し、統一されたWorkerエントリーポイントからAPI機能を提供します。

## 実行環境の特徴

- **Cloudflare Workers Runtime（V8）**で実行
- **Web標準API使用**: `fetch`, `Request`, `Response`, `URL`等
- **Node.js API使用不可**: `fs`, `path`, `os`等は利用不可
- **TypeScript型**: 自動生成された`worker-configuration.d.ts`を参照

## プロジェクト構成

### メインエントリーポイント

- **`_worker.ts`**: 統一Workerエントリーポイント
  - プログラマティックルーティング
  - 静的アセット配信（`env.ASSETS.fetch()`）
  - APIエンドポイントのルーティング

### ドメイン別ハンドラー（DDD アーキテクチャ）

- **`src/middleware.ts`**: セキュリティミドルウェア
- **`src/ogpApi.ts`**: OGPメタデータAPI
- **`src/amazonApi.ts`**: Amazon商品情報API
- **`src/ogImageHandler.ts`**: OG画像生成

## Workers API 使用方法

```typescript
// ✅ Workers方式
export async function handleOgpApi(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const key = env.PAAPI_ACCESSKEY // 環境変数アクセス
  // ハンドラーロジック
}
```

## ローカル開発・デバッグ

```bash
# 通常開発サーバー
pnpm dev

# Workers環境での開発
pnpm dev:cf

# テスト実行
pnpm test

# ビルド
pnpm build

# デプロイ
wrangler deploy
```

## API仕様

### セキュリティミドルウェア

- `/api/*`への全リクエストを検証
- `sec-fetch-mode`ヘッダー認証

### OGP取得API

- **エンドポイント**: `GET /api/getOgp?url={URL}`
- **機能**: 外部サイトOGPメタデータ取得・キャッシュ
- **キャッシュ**: KV 1週間

### Amazon商品情報API

- **エンドポイント**: `GET /api/getAmznPa/{ASIN}`
- **機能**: PA-API v5 Amazon商品データ取得
- **キャッシュ**: KV 24時間
- **制約**: ASIN 10文字英数字のみ

### OG画像生成

- **エンドポイント**: `GET /post/*/twitter-og.png`
- **機能**: ブログ記事用OG画像動的生成（1200x630px）
- **フォント**: Noto Sans JP（日本語対応）

## 移行履歴

### 2025年7月: Pages Functions → Workers + Static Assets

**変更内容**:

- 統一Workerエントリーポイント（`_worker.ts`）への移行
- ドメイン駆動設計（DDD）に基づくハンドラー分離
- TypeScript型安全性の向上
- テストの Workers API 対応

**技術的な変更**:

- ハンドラーシグネチャ: `onRequestGet(context)` → `fetch(request, env, ctx)`
- 環境変数アクセス: `context.env` → `env`
- ルートパラメータ: `context.params` → 手動URL解析
- 静的アセット: `env.ASSETS.fetch(request)`で配信
