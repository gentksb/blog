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

必要なシークレットは `wrangler.jsonc` の `secrets.required` が正規定義。ローカル開発は `.dev.vars` に同名キーを設定する。

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

## テストコマンド

| コマンド          | 対象                           | 実行場所                  | シークレット                              |
| ----------------- | ------------------------------ | ------------------------- | ----------------------------------------- |
| `pnpm test:light` | unit / domain / adapters       | ローカル・Claude Code Web | 不要                                      |
| `pnpm test`       | 全テスト（実 Amazon API 含む） | CI のみ                   | PARTNER*TAG / CREATORS_CREDENTIAL*\* 必要 |

Claude Code Web サンドボックスでは常に `pnpm test:light` を使用する。`pnpm test` は CI（lint-test.yml）に委任。

## 依存更新ルーチン

`.claude/automation/dependency-update.md` に定義した手順を Claude Code Web の scheduled agent（週次 月曜 09:00 JST）が実行。

- **グルーピング方針**: dev minor/patch / prod minor/patch / astro-ecosystem / cloudflare / textlint は各 1 PR にまとめ、メジャー更新のみ個別 PR
- **自動マージ**: 既存 `gr2m/merge-schedule-action` を利用。PR 本文の `/schedule` で制御（メジャーは手動マージ）
- **待機中の更新**: `.claude/automation/pending-updates.json` に記録し、次回セッションで参照
- **engine 連動ピン**: `.claude/automation/engine-pinned-packages.json` で宣言したパッケージ（現在 `@types/node` → `maxMajor: 24`）は major PR を作らず pending に積む。Node.js を 25 以上に上げる際はこのファイルの `maxMajor` を手動更新する
- **lockfile conflict 緩和**: `relock-deps-prs.yml` が master push 時に open な `deps/*` PR を自動で `pnpm install --lockfile-only` して push する

## Project Level MCP Server

- `cloudflare-documentation`: Workers/Wrangler ナレッジ
- `astro-docs`: Astro フレームワーク仕様
