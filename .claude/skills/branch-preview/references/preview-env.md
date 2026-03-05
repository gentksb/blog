# プレビュー環境の特性

## KV / 環境識別

- KV は preview_id（本番KVとは分離）を使用
- `WORKERS_CI_BRANCH` でブランチ名判定、`WORKERS_CI=1` で環境識別
- master ブランチ以外では本番 Cloudflare Image Service は無効化される（astro.config.ts の設定）

## OGP キャッシュ陳腐化

プレビュー環境でのOGPカード画像リンク切れは一時的なKVキャッシュ陳腐化が原因の可能性が高い。
Cloudflare Dashboard でプレビューKV（`e77ae49b6b164fbe8a96c4c4cfad8f0d`）のエントリをパージで解消できる。
