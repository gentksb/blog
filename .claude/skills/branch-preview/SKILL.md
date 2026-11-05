---
name: branch-preview
description: Cloudflare Workers のブランチプレビュー確認フロー。PRのプレビューURLを取得してブラウザで確認する。「ブランチプレビュー」「デプロイ確認」「プレビュー確認」と言われた時に使用。
allowed-tools: Bash(gh pr view:*), Bash(gh pr checks:*), Skill(playwright-cli)
---

# ブランチプレビュー確認フロー

## 前提条件

- PR が作成済みであること（未作成なら `branch-start` スキルを先に使用）

## ステップ1: Workers Build の完了確認

```bash
gh pr checks
```

`cloudflare/workers-builds` が `pass` になるまで待つ（通常3〜5分）。

## ステップ2: プレビュー URL の取得

```bash
gh pr view --comments
```

- Preview URL（例: `feature-xxx-blog.xxxx.workers.dev`）を使う。ブランチの最新デプロイを返す
- デプロイ単位の Deployment URL（`<deployment-id>-blog.xxxx.workers.dev`）は特定コミットの確認時のみ使う

## ステップ3: ブラウザで視覚確認

playwright-cli skill を使用。`pnpm dev` は不要。KV とシークレットは本番と異なる（[references/preview-env.md](references/preview-env.md)）。

```bash
playwright-cli open https://<branch-preview-url>
playwright-cli screenshot --filename=/tmp/preview.png
playwright-cli close
```

## ステップ4: Workers 実行ログ確認（動的機能のデバッグ時）

`wrangler tail` は Preview に対応していない。Cloudflare Dashboard の Workers > blog > Previews から対象の Preview を開き、Observability タブでログとトレースを見る。

## 参考

- **プレビュー環境の特性** [references/preview-env.md](references/preview-env.md)
