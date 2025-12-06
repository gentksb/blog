# 幻想サイクル（Genso Cycle）ブログ

## プロジェクト概要

「幻想サイクル」は自転車（ロード・MTB・シクロクロス）に関する機材レビューやレースレポートを扱うブログサイトです。AJOCC C1レーサーによる専門的な自転車関連コンテンツを提供しています。

## 技術スタック

- **フレームワーク**: Astro v5
- **UIライブラリ**: React（部分的に使用）
- **スタイリング**: Tailwind CSS + DaisyUI
- **検索機能**: Pagefind
- **ホスティング**: Cloudflare Workers + Static Assets
- **サーバーサイド**: Cloudflare Workers
- **画像処理**: Cloudflare Image Service
- **データベース**: Cloudflare KV（OGPキャッシュ用）
- **パッケージマネージャー**: pnpm

## 主要機能

1. **ブログ機能**:
   - MDXを使用したコンテンツ管理
   - タグ・カテゴリによる記事分類
   - ページネーション機能（1ページあたり12記事）
   - タグページ機能（`/tag/[tag]/[page]`）
     - タグごとのページネーション付き記事一覧
     - タグクラウドによる視覚的なナビゲーション
     - 記事ページからのクリック可能なタグリンク

2. **特殊コンポーネント**:
   - Amazon商品リンク表示（PA-API連携）
   - OGP情報取得と表示
   - ソーシャルシェア機能
   - 関連記事表示
   - 外部リンクカード表示

3. **開発機能**:
   - Biome + Prettierによるコード整形
     - **Biome**: TS/TSX/JS/JSXファイルのリント・フォーマット
     - **Prettier**: Astroファイルのフォーマット（Biome実験的サポート待ち）
     - インデントはダブルスペース
   - Textlintによる日本語文章校正
   - Vitestによるテスト
   - Redirectルール設定

## プロジェクト構造

- **`src/content/post/`**: ブログ記事（MDXファイル）を年/月/記事名で管理（2012年〜2025年）
- **`src/components/`**: 再利用可能なUIコンポーネント
  - **`mdx/`**: MDX内で使用する特殊コンポーネント（Amzn, LinkCard等）
  - **`jsx/`**: React UIコンポーネント
  - **`TagCloud.astro`**: タグ一覧とタグクラウド表示
  - **`Paginate.astro`**: ページネーションコンポーネント（タグページ対応）
- **`src/layouts/`**: ページレイアウト定義
- **`src/pages/`**: ルーティング定義
  - **`tag/[tag]/[page].astro`**: タグ別記事一覧ページ（動的ルーティング）
- **`functions/`**: Cloudflare Workersのサーバーサイド処理（[詳細](functions/CLAUDE.md)）
  - `_worker.ts`: 統一Workerエントリーポイント
  - `src/`: ドメイン別ハンドラー（DDDアーキテクチャ）
    - Amazon商品情報取得API
    - OGP情報取得API
    - OG画像生成
    - セキュリティミドルウェア

## 環境変数

```bash
PAAPI_ACCESSKEY    # PA-API v5 Access key ID
PAAPI_SECRETKEY    # PA-API v5 Secret key
PARTNER_TAG        # Amazon Associate Partner Tag
SLACK_WEBHOOK_URL  # Slack webhook URL for logging
```

## デプロイフロー

- Cloudflare Workers + Static Assetsでのビルド・デプロイ
- 通常開発： `pnpm dev`（`pnpm astro dev` - Astroの開発サーバー）
- Workers開発： `pnpm dev:cf`（`pnpm typegen && pnpm run build && wrangler dev` - Workers環境での開発）
- 本番ビルド： `pnpm build`（`pnpm typegen && pnpm astro build`）

### 設定ファイル

- **`wrangler.jsonc`**: Workers設定（KVバインディング、静的アセット設定等）
- **`astro.config.ts`**: Astro設定（出力ディレクトリ：`./dist/`）

## 特記事項

- 2012年から現在までの長期間にわたる記事アーカイブを保持
- 多数のリダイレクトルールが設定されており、過去の記事URLからの移行対応がされている
- サイクリング関連のZwiftワークアウトファイルなども配布
- Cloudflare画像サービスを本番環境で活用（maxWidth: 800px）
- OGPキャッシュを活用して外部データ取得を最適化
- **タグ管理**: 18個の正規化されたタグセットを使用
  - ビルド時間最適化のため、低頻度タグは統合済み
  - 主要タグ： REVIEW, CX, ROAD, RACEREPORT, MTB, TIPS, GRAVEL, Workout, Zwift等
  - レガシーURL（`/category/*`, `/categories/*`, `/search/label/*`）は新しい`/tag/*`構造にリダイレクト

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

## メンテナンス用ツール

### MCP Server

- cloudflare-documentation
  - Cloudflare WorkersおよびWorkersランタイム・Wranglerに関するナレッジを取得する際に利用
- astro-docs
  - Astroのフレームワーク仕様・各APIで利用できるメソッドや設定について検索する際に利用
- chrome-devtools
  - フロントエンド変更時、開発サーバーを起動して情報を取得する際に利用。`pnpm run dev` コマンドと併用。

### 画像リサイズスクリプト

リポジトリサイズ縮小のため、`src/content/`配下の大きな画像ファイルを一括リサイズするスクリプトを提供しています。

**実行方法**:

```bash
./resize_images.sh
```

**処理内容**:

- 対象： `src/content/`配下の画像ファイル（jpg, jpeg, png, webp）
- 条件： 横幅1200px以上の画像のみ
- 処理： 横幅1200px以下にリサイズ（アスペクト比維持）
- 安全性： 処理前にバックアップ作成、エラー時は自動復元

**注意事項**:

- 1回限りの実行を想定したスクリプトです
- 実行前に重要なファイルをバックアップしてください
- ImageMagickが必要です（`identify`, `mogrify`コマンド）

## プロジェクト情報の更新について

**重要**: プロジェクトの技術スタック、構成、依存関係、設定ファイルなどを変更した際は、必ずこのCLAUDE.mdファイルを更新してください。このファイルはプロジェクトの現在の状態を正確に反映する必要があります。

更新が必要な変更例：

- 新しい依存関係やライブラリの追加・削除
- ビルド・デプロイフローの変更
- 設定ファイルの追加・変更・削除
- プロジェクト構造の変更
- 環境変数の追加・削除
- 新機能やコンポーネントの追加
