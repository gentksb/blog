# 幻想サイクル（Genso Cycle）ブログ

## 技術スタック

- **フレームワーク**: Astro v5
- **UIライブラリ**: React（部分的に使用）
- **スタイリング**: Tailwind CSS + DaisyUI
- **検索機能**: Pagefind
- **ホスティング**: Cloudflare Workers + Static Assets
- **サーバーサイド**: Cloudflare Workers
- **画像処理**: Cloudflare Image Service
- **データベース**: Cloudflare KV（OGP, PAAPIデータキャッシュ用）
- **パッケージマネージャー**: pnpm

### スタック選定背景

ブログというコンテンツの性質上、ほとんどのアセットを静的配信できるほか、新規記事のアップロードや編集と明確なイベントを基に更新できる。SSGとMarkdown管理をベースとするAstroをフレームワークとして採用。

例外的に、Amazon PAAPIデータとリンクカードのOGPデータのみ動的に取得している。ここについてはAstroがReactコンポーネントを配信し、部分的にSPA構成としてCloudflare Workersで作成したAPIからフェッチすることで解決している。PAAPIデータは規約上24時間以内のデータを配信する必要があるので、Cloudflare KVに24時間TTLでキャッシュしている。サイト内検索についてもPagefindを用いた静的配信を使い、ユーザーアクセス時にサーバサイド処理をなるべく行わない構成としている。

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

## 環境変数

```bash
PAAPI_ACCESSKEY    # PA-API v5 Access key ID
PAAPI_SECRETKEY    # PA-API v5 Secret key
PARTNER_TAG        # Amazon Associate Partner Tag
SLACK_WEBHOOK_URL  # Slack webhook URL for logging
```

## デプロイフロー

Cloudflare Workers + Static AssetsでのGitHubリポジトリ連携でビルド・デプロイ。ローカルからデプロイは行わない。

## 開発ワークフロー

- 通常開発： `pnpm dev` Astro開発サーバーのみ起動、記事執筆中や外観の変更時に高速なフィードバックを得たい時に利用。バックエンドにアクセスするコンポーネントは機能せず、フォールバックされる。
- Workers開発： `pnpm dev:cf` Wrangler CLIを使ってWorkers環境でのフル機能開発サーバーを起動。Astroのビルドを含むため起動時間が長い点に注意。
- 本番ビルド： `pnpm build` フル機能開発時にAstro側の更新を反映したい場合に利用。

### 設定ファイル

- **`wrangler.jsonc`**: Workers設定（KVバインディング、静的アセット設定等）
- **`astro.config.ts`**: Astro設定（出力ディレクトリ：`./dist/`）

## 特記事項

- 2012年から現在までの長期間にわたる記事アーカイブを保持
- 多数のリダイレクトルールが設定されており、過去の記事URLからの移行対応がされている
- サイクリング関連のZwiftワークアウトファイルなども配布
- Cloudflare Image Serviceを本番環境で活用（maxWidth: 800px）
- OGPキャッシュを活用して外部データ取得を最適化
- **タグ管理**: 18個の正規化されたタグセットを使用
  - ビルド時間最適化のため、低頻度タグは統合済み
  - 主要タグ： REVIEW, CX, ROAD, RACEREPORT, MTB, TIPS, GRAVEL, Workout, Zwift等
  - レガシーURL（`/category/*`, `/categories/*`, `/search/label/*`）は新しい`/tag/*`構造にリダイレクト

## Cloudflare Workers settings (Not written in `wrangler.jsonc`)

### Build Exclude Path

- `.vscode/*`
- `.github/*`
- `.devcontainer/*`
- `.claude/*`
- `.mcp.json`
- `CLAUDE.md`
- `*.sh`
- `README.md`
- `script/*`
- `.npmrc`

## Project Level MCP Server

- cloudflare-documentation
  - Cloudflare WorkersおよびWorkersランタイム・Wranglerに関するナレッジを取得する際に利用
- astro-docs
  - Astroのフレームワーク仕様・各APIで利用できるメソッドや設定について検索する際に利用
- chrome-devtools
  - フロントエンド変更時、開発サーバーを起動して情報を取得する際に利用。`pnpm run dev` コマンドと併用。

## コーディングエージェント向け：ブランチプレビュー確認フロー

### 前提条件

- `CLOUDFLARE_API_TOKEN`環境変数をホストシステムに設定（`wrangler tail`でのログ確認に必要）
- `CLOUDFLARE_ACCOUNT_ID`環境変数をホストシステムに設定
- これらはローカル`~/.zshrc`等に設定し、コードリポジトリには含めない

### ブランチプレビュー確認手順

#### ステップ1: ブランチ作成・変更・プッシュ

```bash
git switch -c <branch-name>
# ... 変更作業 ...
git add <files>
git commit -m "変更内容"
git push -u origin <branch-name>
```

#### ステップ2: PR作成

```bash
gh pr create --title "PRタイトル" --body "変更内容"
```

#### ステップ3: Workers Buildの完了確認

```bash
# Workers BuildsはGitHub Checksとして統合されているため gh pr checks で確認できる
gh pr checks
# "cloudflare/workers-builds" チェックが "pass" になるまで待つ（通常3〜5分）
```

#### ステップ4: プレビューURLの取得

```bash
# Workers Buildが完了するとPRコメントにプレビューURLが自動投稿される
gh pr view --comments
# "Branch Preview URL" と "Commit Preview URL" の2種類が含まれる
# Branch Preview URL（例: feature-xxx-blog.xxxx.workers.dev）が推奨（ブランチ最新版を参照）
```

#### ステップ5: ブラウザでプレビュー確認

playwright-cli skillを使用して視覚的に確認する。
`pnpm dev`は不要（プレビューURLは本番同等環境）。

```bash
playwright-cli open https://<branch-preview-url>
playwright-cli screenshot
playwright-cli close
```

#### ステップ6: Workers実行ログ確認（動的機能のデバッグ時）

```bash
# CLOUDFLARE_API_TOKENが設定されている場合
wrangler tail --format=pretty
# プレビュー環境へのリクエストのログがリアルタイムで表示される
```

### ブランチ名の注意事項

- プレビューURLはDNSラベルになるため小文字・数字・ハイフンのみ使用可能
- `<branch-name>-blog` の合計が63文字を超える場合は自動短縮される
- アンダースコアはハイフンに変換される

### プレビュー環境の特性

- KVはpreview_id（本番KVとは分離）を使用
- `WORKERS_CI_BRANCH`でブランチ名判定、`WORKERS_CI=1`で環境識別
- masterブランチ以外では本番Cloudflare Image Serviceは無効化される（astro.config.tsの設定）
