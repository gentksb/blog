# pnpm 週次依存更新ルーチン

Claude Code Web scheduled agent（週次 月曜 UTC 00:00）がこのファイルの手順を実行する。
ローカルから手動で `/loop` 実行する場合も同じ手順に従う。

## 前提確認

1. `git switch master`
2. `git pull`
3. `pnpm install --frozen-lockfile`

## 候補の特定

4. `.claude/automation/pending-updates.json` を読み込み、`recheckAfter <= now` のエントリを「再チェック対象」として記録する。`recheckAfter > now` のエントリは今回スキップ（手順終了時に再書き込み）。
5. `pnpm outdated --format json` を実行して更新可能な依存を取得する。
6. `minimumReleaseAge=1440` により pnpm が除外したバージョン（`pnpm outdated` に現れない最新リリース）は、`npm view <pkg> time --json` で確認し、公開から 24 時間未満なら `pending-updates.json` の `entries` に追記して commit し、以降の手順をスキップする。

## グルーピング

候補を以下のグループに分類する。ひとつの候補が複数グループに該当する場合は最初に該当したグループ優先。

| グループ名         | 対象パッケージ（prefix/name）                   | 自動マージ          |
| ------------------ | ----------------------------------------------- | ------------------- |
| `astro-ecosystem`  | `astro`, `@astrojs/*`, `astro-*`                | 手動                |
| `cloudflare`       | `wrangler`, `@cloudflare/*`, `@cf-wasm/*`       | 手動                |
| `textlint`         | `textlint`, `textlint-rule-*`, `@textlint-ja/*` | 週末 UTC 03:00      |
| `dev-minor-patch`  | devDependencies の minor/patch（上記以外）      | 翌営業日 UTC 22:00  |
| `prod-minor-patch` | dependencies の minor/patch（上記以外）         | 週末 UTC 03:00      |
| `major:<pkg>`      | メジャー更新（いずれのグループでも）            | 手動（PR のみ作成） |

メジャー更新は他グループと混在させず、パッケージごとに個別ブランチ・個別 PR とする。

## グループごとの実行（以下を各グループで繰り返す）

### ブランチ作成

7. ブランチ名: `deps/<group-name>-<YYYYMMDD>`（例: `deps/dev-minor-patch-20260421`）
8. `git switch -c deps/<group-name>-<YYYYMMDD>`

### 更新実行

9. `pnpm update <pkg1> <pkg2> ...`（グループ内の全パッケージを一度に指定）

### ワークアラウンド棚卸し

10. `git grep -n "TODO\|FIXME\|HACK\|workaround\|pinned\|downgrade" -- src/ test/` を実行し、更新対象パッケージに関係するコメントがあれば、そのバグ・制約が当該バージョンで解消されているか CHANGELOG を確認する。解消済みなら同 PR でコードも修正する。

### Breaking Change 調査

11. 各更新パッケージについて:
    - `npm view <pkg>@<newver> homepage` でホームページ URL を取得
    - `gh api repos/<owner>/<repo>/releases/tags/v<newver>` で release notes を取得（取得できなければ `npm view <pkg>@<newver> changelog` を参照）
    - `grep -rn "<import-pattern>" src/ test/` で利用箇所を特定
    - Breaking Change があれば PR body の「Breaking Change」セクションに箇条書きで記載し、未解決の場合は `pending-updates.json` に `reason: "breaking-change-unresolved"` で積んで更新を戻す

### 品質チェック

12. `pnpm test:light`（シークレット不要の unit / domain / adapters のみ）
13. `pnpm lint`（Prettier チェック）
14. `pnpm lint:unused`（Knip — `knip.json` の `ignoreFiles` / `ignoreDependencies` は変更しない）

いずれかが失敗した場合: `git reset --hard master` でブランチをリセットし、失敗理由を `pending-updates.json` に記録して次のグループへ進む。

### コミット・PR 作成

15. `git add pnpm-lock.yaml package.json`（src/ の修正があれば追加）
16. `git commit -m "deps(<group-name>): update <list>"`
17. `git push -u origin deps/<group-name>-<YYYYMMDD>`
18. `gh pr create` で PR 作成。本文テンプレート:

```
## 依存更新: <group-name>

| パッケージ | 旧バージョン | 新バージョン |
|---|---|---|
| <pkg> | <old> | <new> |

## Breaking Change
（なし / または箇条書き）

## ワークアラウンド解消
（なし / または解消内容）

## テスト
- [x] pnpm test:light 通過
- [x] pnpm lint 通過
- [x] pnpm lint:unused 通過
- [ ] CI (pnpm test) — push 後に自動実行

/schedule <ISO8601>
```

`/schedule` の日時（自動マージ用）:

- `textlint` / `prod-minor-patch`: 次の土曜 UTC 03:00
- `dev-minor-patch`: 翌営業日 UTC 22:00
- `astro-ecosystem` / `cloudflare` / `major:*`: `/schedule` 行を入れない（手動マージ）

19. 次のグループへ進む。`master` に戻ってから次のブランチを切る（`git switch master`）。

## 終了処理

20. `pending-updates.json` を更新:
    - 今回処理済みのエントリを削除
    - 新規追加・失敗・`recheckAfter > now` でスキップしたエントリを保持
21. `pending-updates.json` に変更があれば `master` に直接 commit して push する:
    - `git switch master`
    - `git add .claude/automation/pending-updates.json`
    - `git commit -m "chore: update pending-updates"`
    - `git push`

## 最終レポート（標準出力）

```
=== 依存更新ルーチン 完了 ===
作成 PR: <list>
pending に積んだ候補: <list>
手動レビュー推奨: <list>
```

## 制約事項

- `knip.json` の `ignoreFiles` / `ignoreDependencies` は変更しない（`.claude/rules/knip.md` 参照）
- Bash コマンドは 1 行 1 コマンドで実行する。`&&` で連結しない
- `pnpm deploy` / `wrangler deploy` は実行しない（デプロイは CF Workers Builds が担当）
- メジャー更新の PR には `/schedule` を入れない
- CI の `pnpm test`（実 Amazon API）は push 後に GitHub Actions が実行するので、ルーチン内では実行不要
