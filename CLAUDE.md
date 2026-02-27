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

3. **VS Code執筆支援**
   - @.vscode/markdown.code-snipetts に、記事MDXファイルのFrontomatterスニペット及び、特殊コンポーネントのPropsテンプレート付きスニペットを登録
   - @.vscode/settings.json において、Copilotサジェスト無効化・リアルタイムフォーマットの無効化（保存時のみ起動）を設定し、執筆時の認知ノイズを削減

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

- 通常開発： `pnpm dev` Astro開発サーバーのみ起動、記事執筆中や外観の変更時に高速なフィードバックを得たい時に利用。バックエンドにアクセスするコンポーネントは機能せず、フォールバックされる。
- Workers開発： `pnpm dev:cf` Wrangler CLIを使ってWorkers環境でのフル機能開発サーバーを起動。Astroのビルドを含むため起動時間が長い点に注意。
- 本番ビルド： `pnpm build` フル機能開発時にAstro側の更新を反映したい場合に利用。

### コード管理

- Linter: Prettierを `pnpm lint:fix` で修正。自動修正できないエラーは `pnmpm lint` で表示して手動で変更
- Cleanup(MUST): TypeScriptクリーンアップを `git push` 前にKnipを `pnpm lint:unused` で実行

#### knip.json の ignoreFiles / ignoreDependencies について

意図的に多数の除外設定が入っている。誤って削除しないこと。

- **`ignoreFiles`（MDXコンポーネント群）**: `Amzn.astro`, `LinkCard.astro`, `SimpleLinkCard.astro`, `positive.tsx`, `negative.tsx` およびそれらが依存するファイルは、`astro-auto-import` で全MDXファイルにビルド時注入される。knipにはastro-auto-importプラグインがなく、かつ `src/content/**` がignore対象のためknipが使用を検出できない。
- **`ignoreFiles`（`cfImageService.ts`）**: `astro.config.ts` 内で文字列として参照されるため静的解析で検出不可。
- **`ignoreDependencies`（`textlint-*`）**: VS Code拡張（vscode-textlint）が直接参照する。scriptsやCIには登場しないがアンインストール不可。
- **`ignoreDependencies`（`@iconify-json/mdi`, `swr`, `react-icons` 等）**: astro-iconやignoreFiles対象コンポーネントから使用されているが、knipのトレースが届かない。

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
