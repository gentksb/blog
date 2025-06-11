# Cloudflare Pages Functions 開発ガイド

## 実行環境の違い

このディレクトリのコードは**Cloudflare Workers Runtime（V8）**で実行され、AstroのNode.js環境とは完全に異なります。

## Workers特有の制約

- **Node.js API使用不可**: `fs`, `path`, `os`等は利用できません
- **Web標準API使用**: `fetch`, `Request`, `Response`, `URL`等を使用
- **環境変数アクセス**: 関数の`env`パラメータから取得（`process.env`不可）
- **TypeScript型**: `@cloudflare/workers-types`の型定義を参照

## 環境変数の取得方法

```typescript
// ❌ Node.js方式（使用不可）
const key = process.env.PAAPI_ACCESSKEY;

// ✅ Workers方式
export const onRequest: PagesFunction<Env> = async (context) => {
  const key = context.env.PAAPI_ACCESSKEY;
};
```

## ローカル開発・デバッグ

```bash
# 開発サーバー起動（wrangler使用）
wrangler pages dev -- pnpm astro dev

# Functions単体テスト
pnpm test
```

## API仕様

### セキュリティミドルウェア（`api/_middleware.ts`）

- `/api/*`への全リクエストを検証
- `sec-fetch-mode`ヘッダーで認証済みリクエストのみ許可

### OGP取得API（`api/getOgp.ts`）

- **エンドポイント**： `GET /api/getOgp?url={URL}`
- **機能**： 外部サイトのOGPメタデータ取得・キャッシュ
- **キャッシュ**： KV 1週間
- **制約**： URLサニタイズ必須

### Amazon商品情報API（`api/getAmznPa/[asin].ts`）

- **エンドポイント**： `GET /api/getAmznPa/{ASIN}`
- **機能**： PA-API v5でAmazon商品データ取得
- **キャッシュ**： KV 24時間
- **制約**： ASIN 10文字英数字のみ

### OG画像生成（`post/[[slug]].ts`）

- **エンドポイント**： `GET /post/*/twitter-og.png`
- **機能**： ブログ記事用OG画像動的生成（1200x630px）
- **フォント**： Noto Sans JP（日本語対応）

## KV・外部API連携

- Cloudflare KVは`context.env.KV_NAMESPACE`でアクセス
- Amazon PA-API、Slack Webhook等の外部API呼び出しは`fetch`使用
- エラーハンドリングとログ送信を`postLogToSlack`で実装
