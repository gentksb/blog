---
name: branch-start
description: 新しい機能開発を開始する際のブランチ作成・コミット・PR作成フロー。「プランモード完了」「新しい作業を始める」「ブランチを作る」「ブランチを切る」「PR を作成する」「作業開始」と言われた時に使用。
allowed-tools: Bash(git switch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*)
---

# 開発セッション開始フロー

## ルール

**1機能開発 = 1PR = 1ブランチ。** セッション内でフェーズを分ける場合もブランチを分けない。

## ステップ1: ブランチ作成

```bash
git switch -c <branch-name>
```

ブランチ命名の詳細は [references/branch-naming.md](references/branch-naming.md) を参照。

## ステップ2: 変更・コミット・プッシュ

```bash
git add <files>
git commit -m "変更内容"
git push -u origin <branch-name>
```

## ステップ3: PR 作成

```bash
gh pr create --title "PRタイトル" --body "変更内容"
```

PR 作成後、Cloudflare Workers のプレビュー確認をする場合は `branch-preview` スキルを使用。
