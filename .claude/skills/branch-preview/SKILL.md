---
name: branch-preview
description: Cloudflare Workers のブランチプレビュー確認フロー。PRのプレビューURLを取得してブラウザで確認する。ブランチプレビュー、デプロイ確認、プレビュー確認と言われた時に使用。
allowed-tools: Bash(git switch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr checks:*), Bash(wrangler tail:*), Skill(playwright-cli)
---

# ブランチプレビュー確認フロー

Cloudflare Workers + Static Assets 環境でのブランチプレビューを確認する手順。

## 前提条件

- `CLOUDFLARE_API_TOKEN` 環境変数をホストシステムに設定（`wrangler tail` でのログ確認に必要）
- `CLOUDFLARE_ACCOUNT_ID` 環境変数をホストシステムに設定

## 手順

### ステップ1: ブランチ作成・変更・プッシュ

> **ルール**: 1開発セッション = 1ブランチ。セッション内でフェーズを分ける場合もブランチを分けない。

```bash
git switch -c <branch-name>
git add <files>
git commit -m "変更内容"
git push -u origin <branch-name>
```

### ステップ2: PR作成

```bash
gh pr create --title "PRタイトル" --body "変更内容"
```

### ステップ3: Workers Build の完了確認

```bash
gh pr checks
```

`cloudflare/workers-builds` チェックが `pass` になるまで待つ（通常3〜5分）。

### ステップ4: プレビューURL の取得

```bash
gh pr view --comments
```

- `Branch Preview URL` と `Commit Preview URL` の2種類が含まれる
- Branch Preview URL（例: `feature-xxx-blog.xxxx.workers.dev`）が推奨（ブランチ最新版を参照）

### ステップ5: ブラウザでプレビュー確認

playwright-cli skill を使用して視覚的に確認する。`pnpm dev` は不要（プレビューURLは本番同等環境）。

```bash
playwright-cli open https://<branch-preview-url>
playwright-cli screenshot --filename=/tmp/preview.png
playwright-cli close
```

### ステップ6: Workers 実行ログ確認（動的機能のデバッグ時）

```bash
wrangler tail --format=pretty
```

プレビュー環境へのリクエストのログがリアルタイムで表示される。

## ブランチ名の注意事項

- プレビューURLはDNSラベルになるため小文字・数字・ハイフンのみ使用可能
- `<branch-name>-blog` の合計が63文字を超える場合は自動短縮される
- アンダースコアはハイフンに変換される

## プレビュー環境の特性

- KV は preview_id（本番KVとは分離）を使用
- `WORKERS_CI_BRANCH` でブランチ名判定、`WORKERS_CI=1` で環境識別
- master ブランチ以外では本番 Cloudflare Image Service は無効化される（astro.config.ts の設定）
