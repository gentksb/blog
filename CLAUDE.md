# 幻想サイクル（Genso Cycle）ブログ

## 技術スタック

- **フレームワーク**: Astro v6（Server Islands）
- **UIライブラリ**: React（SocialShare, StickyToc のみ）
- **スタイリング**: Tailwind CSS
- **検索機能**: Pagefind
- **ホスティング**: Cloudflare Workers + Static Assets
- **サーバーサイド**: Cloudflare Workers
- **画像処理**: Cloudflare Image Service
- **データベース**: Cloudflare KV（OGP, PAAPIデータキャッシュ用）
- **パッケージマネージャー**: pnpm

Server Islands（`server:defer`）で `LinkCard.astro` / `Amzn.astro` がサーバーサイドで KV と外部 API にアクセス。PAAPIデータは KV に24時間 TTL でキャッシュ。

## 環境変数

```bash
CREATORS_CREDENTIAL_ID      # Amazon Creators API Credential ID
CREATORS_CREDENTIAL_SECRET  # Amazon Creators API Credential Secret
PARTNER_TAG                 # Amazon Associate Partner Tag
SLACK_WEBHOOK_URL           # Slack webhook URL for logging
```

## デプロイフロー

Cloudflare Workers + Static AssetsでのGitHubリポジトリ連携でビルド・デプロイ。ローカルからデプロイは行わない。

## 開発ワークフロー

- 通常開発： `pnpm dev` 開発サーバーが workerd（Miniflare）上で動作。HMR付きで KV バインディングもローカルシミュレーション可能
- 本番ビルド確認： `pnpm dev:cf` `pnpm build` 後に `wrangler dev --config dist/server/wrangler.json` で serve
- 本番ビルド： `pnpm build`

### コード管理

- Linter: Prettierを `pnpm lint:fix` で修正。自動修正できないエラーは `pnpm lint` で表示して手動で変更
- Cleanup(MUST): TypeScriptクリーンアップを `git push` 前にKnipを `pnpm lint:unused` で実行

### 設定ファイル

- **`wrangler.jsonc`**: Workers設定（KVバインディング、静的アセット設定等）
- **`astro.config.ts`**: Astro設定（出力ディレクトリ：`./dist/`）

## 特記事項

- Cloudflare Image Service 本番のみ有効（maxWidth: 800px）
- **タグ管理**: 18個の正規化タグ。主要: REVIEW, CX, ROAD, RACEREPORT, MTB, TIPS, GRAVEL, Workout, Zwift
  - レガシーURL（`/category/*`, `/categories/*`, `/search/label/*`）は `/tag/*` 構造にリダイレクト済み

## 実装注記

### Cloudflare Workers 環境変数

- `Astro.locals.runtime.env` は廃止 → `import { env } from 'cloudflare:workers'` を使う
- MDXのIslandコンポーネントにおいて、MDXから直接 `server:defer` ディレクティブを持つAstroコンポーネントを使用できないためラッパーパターンを利用

## Project Level MCP Server

- `cloudflare-documentation`: Workers/Wrangler ナレッジ
- `astro-docs`: Astro フレームワーク仕様
