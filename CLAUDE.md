# 幻想サイクル（Genso Cycle）ブログ

## プロジェクト概要

「幻想サイクル」は自転車（ロード・MTB・シクロクロス）に関する機材レビューやレースレポートを扱うブログサイトです。AJOCC C1レーサーによる専門的な自転車関連コンテンツを提供しています。

## 技術スタック

- **フレームワーク**: Astro
- **UIライブラリ**: React（部分的に使用）
- **スタイリング**: Tailwind CSS + DaisyUI
- **検索機能**: Pagefind
- **ホスティング**: Cloudflare Pages + Functions
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
- **`functions/`**: Cloudflare Functionsのサーバーサイド処理（[詳細](functions/CLAUDE.md)）
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

- Cloudflare Pagesでのビルド・デプロイ
- 開発環境： `pnpm typegen && wrangler pages dev -- pnpm astro dev`
- 本番ビルド： `pnpm typegen && pnpm astro build`

## 特記事項

- 2012年から現在までの長期間にわたる記事アーカイブを保持
- 多数のリダイレクトルールが設定されており、過去の記事URLからの移行対応がされている
- サイクリング関連のZwiftワークアウトファイルなども配布
- Cloudflare画像サービスを本番環境で活用（maxWidth: 800px）
- OGPキャッシュを活用して外部データ取得を最適化

## ソーシャルメディア連携

- Twitter: gen_sobunya
- GitHub: gentksb
- Instagram: gen_sobunya
- Threads: gen_sobunya
