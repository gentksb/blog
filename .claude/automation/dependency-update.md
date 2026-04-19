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
6. `minimumReleaseAge=1440` により pnpm が除外したバージョン（`pnpm outdated` に現れない最新リリース）は、`npm view <pkg> time --json` で確認し、公開から 24 時間未満なら `pending-updates.json` の `entries` に `reason: "minimumReleaseAge"` で追記し、以降の手順から除外する。
7. `.claude/automation/engine-pinned-packages.json` を読み込む。候補のうちこのリストに名前が載っているパッケージで、かつ `Latest` の major が `maxMajor` を超えるものは `pending-updates.json` の `entries` に `reason: "engine-pinned"` と `notes` に理由を記録して追記し、以降の手順から除外する。

ここまでの除外後に残った候補を「処理対象リスト」とする。処理対象リストが空の場合は「終了処理」へ進む。

## ブランチ作成

8. ブランチ名: `deps/update-<YYYYMMDD>`（例: `deps/update-20260421`）
9. `git switch -c deps/update-<YYYYMMDD>`

## フェーズ 1: semver range 内一括更新（patch + minor）

10. `pnpm update`（引数なし、すべての依存を semver range 内で一括更新）
11. `git diff --unified=0 package.json` を確認し、major バージョンの変化がないことを確認する。major の変化を検出したパッケージがあれば `git restore package.json pnpm-lock.yaml` で変更を戻し、当該パッケージを `pending-updates.json` に `reason: "breaking-change-unresolved"` で追記したうえで、当該パッケージを除いた `pnpm update <pkg1> <pkg2> ...` を明示指定で再実行する。

## フェーズ 2: major 更新

12. 処理対象リストのうち、`pnpm outdated` で `Current` と `Latest` の major が異なるパッケージ（major 更新候補）を抽出する。
13. 各 major 更新候補について、以下を順に実施する:

    a. **Breaking Change 調査**
    - `npm view <pkg>@<newver> homepage` でホームページ URL を取得
    - `gh api repos/<owner>/<repo>/releases/tags/v<newver>` で release notes を取得（取得できなければ `npm view <pkg>@<newver> changelog` を参照）
    - `grep -rn "<import-pattern>" src/ test/` で利用箇所を特定
    - Breaking Change があり未解決の場合は `pending-updates.json` に `reason: "breaking-change-unresolved"` で追記し、このパッケージの更新をスキップ
    - Breaking Change がない（または解消済みの）場合のみ次のステップへ進む

    b. **更新実行**
    - devDependencies のパッケージ: `pnpm add -D <pkg>@<newver>`
    - dependencies のパッケージ: `pnpm add <pkg>@<newver>`

    c. **ワークアラウンド棚卸し**
    - `git grep -n "TODO\|FIXME\|HACK\|workaround\|pinned\|downgrade" -- src/ test/` を実行し、更新対象パッケージに関係するコメントがあれば、そのバグ・制約が当該バージョンで解消されているか CHANGELOG を確認する。解消済みなら同 PR でコードも修正する。

## 品質チェック

14. `pnpm test:light`（シークレット不要の unit / domain / adapters のみ）
15. `pnpm lint`（Prettier チェック）
16. `pnpm lint:unused`（Knip — `knip.json` の `ignoreFiles` / `ignoreDependencies` は変更しない）

いずれかが失敗した場合:

- 失敗の原因となったパッケージを特定し、そのパッケージの変更のみ `git restore` で戻す
- 当該パッケージを `pending-updates.json` に `reason: "test-failure"` で追記する
- 残りの変更で品質チェックを再実行する
- 再実行も失敗する場合は `git reset --hard master` でブランチをリセットして「終了処理」へ進む

## コミット・PR 作成

品質チェック通過後、実際に変更が存在する場合（`git diff --quiet HEAD` でない場合）のみ以下を実行する。

17. `git add pnpm-lock.yaml package.json`（src/ の修正があれば追加）
18. コミットメッセージ:
    - patch/minor のみの場合: `git commit -m "deps: update patch/minor"`
    - major を含む場合: `git commit -m "deps: update including major upgrades"`
19. `git push -u origin deps/update-<YYYYMMDD>`
20. `gh pr create` で PR 作成。本文テンプレート:

```
## 依存更新

| パッケージ | 旧バージョン | 新バージョン | 種別 |
|---|---|---|---|
| <pkg> | <old> | <new> | patch/minor/major |

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

`/schedule` の日時:

- PR に major 更新が含まれない場合: 次の月曜 22:00 UTC（例: `/schedule 2026-04-27T22:00:00Z`）
- PR に major 更新が含まれる場合: `/schedule` 行を入れない（手動マージ）

## 終了処理

21. `pending-updates.json` を更新:
    - 今回 PR に含めた（処理済みの）エントリを削除
    - 新規追加・失敗・`recheckAfter > now` でスキップしたエントリを保持
22. `pending-updates.json` に変更があれば `master` に直接 commit して push する:
    - `git switch master`
    - `git add .claude/automation/pending-updates.json`
    - `git commit -m "chore: update pending-updates"`
    - `git push`

## 最終レポート（標準出力）

```
=== 依存更新ルーチン 完了 ===
作成 PR: <URL または「なし」>
PR 内容: patch/minor <N> 件、major <N> 件
pending に積んだ候補: <list>
手動レビュー推奨: <list>
```

## 制約事項

- `knip.json` の `ignoreFiles` / `ignoreDependencies` は変更しない（`.claude/rules/knip.md` 参照）
- Bash コマンドは 1 行 1 コマンドで実行する。`&&` で連結しない
- `pnpm deploy` / `wrangler deploy` は実行しない（デプロイは CF Workers Builds が担当）
- major 更新を含む PR には `/schedule` を入れない
- CI の `pnpm test`（実 Amazon API）は push 後に GitHub Actions が実行するので、ルーチン内では実行不要
