---
name: branch-preview
description: Cloudflare Workers のブランチプレビュー確認フロー。PRのプレビューURLを取得してブラウザで確認する。「ブランチプレビュー」「デプロイ確認」「プレビュー確認」と言われた時に使用。
allowed-tools: Bash(gh pr view:*), Bash(gh pr checks:*), Bash(wrangler tail:*), Skill(playwright-cli)
---

# ブランチプレビュー確認フロー

## 前提条件

- PR が作成済みであること（未作成なら `branch-start` スキルを先に使用）
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 環境変数が設定済み（`wrangler tail` 使用時のみ）

## ステップ1: Workers Build の完了確認

```bash
gh pr checks
```

`cloudflare/workers-builds` が `pass` になるまで待つ（通常3〜5分）。

## ステップ2: プレビュー URL の取得

```bash
gh pr view --comments
```

- **Branch Preview URL**（例: `feature-xxx-blog.xxxx.workers.dev`）が推奨（ブランチ最新版）
- Commit Preview URL も含まれるが Branch Preview URL を優先

## ステップ3: ブラウザで視覚確認

playwright-cli skill を使用。`pnpm dev` は不要（プレビューURLは本番同等環境）。

```bash
playwright-cli open https://<branch-preview-url>
playwright-cli screenshot --filename=/tmp/preview.png
playwright-cli close
```

## ステップ4: Workers 実行ログ確認（動的機能のデバッグ時）

```bash
wrangler tail --format=pretty
```

## 参考

- **プレビュー環境の特性** [references/preview-env.md](references/preview-env.md)
