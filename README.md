# README

This is gensobunya's bike blog repository.

[Go to website](http://blog.gensobunya.net)

## Build & Deploy Pipeline

### Build for

Cloudflare Workers + Static Assets (w/ KV)

### Local Development

```bash
# Setup authentication
npx wrangler login

# Development server (Astro only)
pnpm dev

# Development with Workers environment
pnpm dev:cf

# Build
pnpm build

# Deploy
wrangler deploy
```

### Environment Variables

See `wrangler.jsonc` (`secrets.required`) for the canonical list of required secrets.

## Operation

Delete OGP caches: <https://developers.cloudflare.com/kv/platform/kv-commands/#delete-2>

## Maintenance Tools

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
