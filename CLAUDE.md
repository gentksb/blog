# 幻想サイクル（Genso Cycle）ブログ

## プロジェクト概要

「幻想サイクル」は自転車（ロード・MTB・シクロクロス）に関する機材レビューやレースレポートを扱うブログサイトです。AJOCC C1レーサーによる専門的な自転車関連コンテンツを提供しています。

## 技術スタック

- **フレームワーク**: Astro
- **UIライブラリ**: React（部分的に使用）
- **スタイリング**: Tailwind CSS + DaisyUI
- **検索機能**: Pagefind
- **ホスティング**: Cloudflare Workers + Static Assets
- **サーバーサイド**: Cloudflare Workers（旧Pages Functions）
- **画像処理**: Cloudflare Image Service
- **データベース**: Cloudflare KV（OGPキャッシュ用）
- **パッケージマネージャー**: pnpm

## 主要機能

1. **ブログ機能**:

   - MDXを使用したコンテンツ管理
   - タグ・カテゴリによる記事分類
   - ページネーション機能（1ページあたり12記事）

2. **特殊コンポーネント**:

   - Amazon商品リンク表示（PA-API連携）
   - OGP情報取得と表示
   - ソーシャルシェア機能
   - 関連記事表示
   - 外部リンクカード表示

3. **開発機能**:
   - ESLint/Prettierによるコード整形
   - Textlintによる日本語文章校正
   - Vitestによるテスト
   - Redirectルール設定

## プロジェクト構造

- **`src/content/post/`**: ブログ記事（MDXファイル）を年/月/記事名で管理（2012年〜2025年）
- **`src/components/`**: 再利用可能なUIコンポーネント
  - **`mdx/`**: MDX内で使用する特殊コンポーネント（Amzn, LinkCard等）
  - **`jsx/`**: React UIコンポーネント
- **`src/layouts/`**: ページレイアウト定義
- **`src/pages/`**: ルーティング定義
- **`functions/`**: Cloudflare Workers Functions（旧Pages Functions）のサーバーサイド処理（[詳細](functions/CLAUDE.md)）
  - Amazon商品情報取得API
  - OGP情報取得API
  - ブログ記事表示

## 環境変数

```
# dev.vars
PAAPI_ACCESSKEY    # PA-API v5 Access key ID
PAAPI_SECRETKEY    # PA-API v5 Secret key
PARTNER_TAG        # Amazon Associate Partner Tag
SLACK_WEBHOOK_URL  # Slack webhook URL for logging
```

## デプロイフロー

- Cloudflare Workers + Static Assetsでのビルド・デプロイ
- 通常開発： `pnpm dev` （`pnpm astro dev` - Astroの開発サーバー）
- Cloudflare開発： `pnpm dev:cf` （`pnpm typegen && pnpm run build && wrangler dev` - Workers環境での開発）
- 本番ビルド： `pnpm build` （`pnpm typegen && pnpm astro build && wrangler pages functions build --outdir=./dist/_worker.js/`）

### 設定ファイル

- **`wrangler.jsonc`**: Workers設定（KVバインディング、静的アセット設定等）
- **`.assetsignore`**: 静的アセットから除外するファイル（_worker.js）

## 特記事項

- 2012年から現在までの長期間にわたる記事アーカイブを保持
- 多数のリダイレクトルールが設定されており、過去の記事URLからの移行対応がされている
- サイクリング関連のZwiftワークアウトファイルなども配布
- Cloudflare画像サービスを本番環境で活用（maxWidth: 800px）
- OGPキャッシュを活用して外部データ取得を最適化

## マイグレーション履歴

### 2025年6月：Cloudflare Pages → Workers Static Assets

**背景**: Cloudflareの推奨により、Pages FunctionsからWorkers Static Assetsへ移行

**変更内容**:
- `wrangler.toml` → `wrangler.jsonc` へ設定移行
- `pages_build_output_dir` → `assets.directory` + `main` フィールドへ変更
- Pages Functions → Workers Functions へのビルドプロセス追加
- 開発・ビルドコマンドの `wrangler pages` → `wrangler` への変更
- `.assetsignore` ファイル追加で _worker.js の静的配信除外
- 環境変数の変更: `CF_PAGES_*` → `CLOUDFLARE_ENV` へ移行

## コード品質とテスト方針

### CI/CD対象ディレクトリ
- **functions/**: Cloudflare Workers Functions（API実装）
- **src/components/**: UIコンポーネント
- **src/layouts/**: ページレイアウト
- **src/lib/**: ユーティリティ関数
- **test/**: テストファイル
- 設定ファイル（package.json、tsconfig.json、vitest.config.ts、wrangler.jsonc、.assetsignore）

### Textlint方針
- **CI/CD対象外**: `src/content/post/`（2012年〜の過去記事）
  - 理由：textlint未対応時に作成された大量の過去記事の修正は非現実的
  - エディタ上でのlint表示は有効（ローカル開発時の参考情報として活用）
- **新規記事**: エディタ上のtextlint警告を参考に品質を確保
- **コンポーネント等**: CI/CDでのESLint/TypeScriptチェック必須

## ソーシャルメディア連携

- Twitter: gen_sobunya
- GitHub: gentksb
- Instagram: gen_sobunya
- Threads: gen_sobunya
