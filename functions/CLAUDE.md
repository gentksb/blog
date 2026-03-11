# Cloudflare Workers + Static Assets 開発ガイド

## アーキテクチャ概要

このプロジェクトは**Cloudflare Workers + Static Assets**アーキテクチャを使用します。

Workerエントリーポイントは Astro adapter が `dist/server/entry.mjs` として自動生成します。このディレクトリ（`functions/`）には、AstroコンポーネントやAstroページから直接インポートされるサービス・アダプター・ドメインロジックのみを管理します。

## プロジェクト構成

### アダプター層（`src/adapters/`）

- **`ogpAdapter.ts`**: OGPメタデータ取得用アダプター（KVキャッシュ・Slackロガー含む）
- **`amazonAdapter.ts`**: Amazon PA-API用アダプター（KVキャッシュ・Slackロガー含む）

### サービス層（`src/services/`）

- **`getOgpMetaData.ts`**: OGPメタデータ取得ロジック
- **`getAmazonProductInfo.ts`**: Amazon商品情報取得ロジック
- **`postLogToSlack.ts`**: Slackへのログ送信
- **`ogImage.tsx`**: OG画像生成（`src/pages/post/[...slug]/twitter-og.png.ts` から使用）

### ドメイン層（`src/domain/`）

- **`transformers.ts`**: レスポンス変換・生成ユーティリティ
- **`validators.ts`**: 入力値バリデーション

## 利用元

各モジュールは以下のAstroコンポーネント・ページから直接インポートされます：

- `src/components/mdx/LinkCard.astro` → OGPアダプター・サービス
- `src/components/mdx/Amzn.astro` → Amazonアダプター・サービス
- `src/pages/post/[...slug]/twitter-og.png.ts` → OG画像サービス
