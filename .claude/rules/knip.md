---
paths:
  - "knip.json"
---

# knip.json の ignoreFiles / ignoreDependencies について

意図的な除外設定であり、削除すると `pnpm lint:unused` が exit 1 になる。現在の全エントリ（ファイル8件・依存16件）が必要であることは、除外を外して knip を実行して確認済み。

`ignore` の4パターンについて Configuration hints が出るが、基準状態の exit code は 0。このヒントを解消しようとしなくてよい。

## ignoreFiles

`src/components/mdx/` の8ファイル（`Amzn.astro`, `AmznServer.astro`, `LinkCard.astro`, `LinkCardServer.astro`, `SimpleLinkCard.astro`, `PositiveBox.astro`, `NegativeBox.astro`, `cardStyles.ts`）:
自作 Vite プラグイン `src/plugins/mdx-auto-import.ts` が、`astro.config.ts` の `mdxAutoImport([...])` の指定に従って全 MDX へ import 文を注入する。knip はこのプラグインを解釈できず、かつ `src/content/**` が ignore 対象のため、除外を外すと8件すべてが Unused files として報告される。

自動注入の対象を追加したときは、そのコンポーネントと専用の依存ファイルをここにも追加する。

## ignoreDependencies

- **`cloudflare`**:
  `import { env } from "cloudflare:workers"` を knip が `cloudflare` パッケージへの参照と解釈する。実体は Workers ランタイム組み込みで package.json には存在しない。除外を外すと Unlisted dependencies として5ファイル分（`src/pages/post/[...slug].md.ts`, `src/server/services/ogImage.tsx`, `test/adapters/` 2件, `test/services/paapi.test.ts`）報告される

- **`tailwindcss`, `@tailwindcss/typography`**:
  Tailwind v4 では `src/styles/global.css` の `@import "tailwindcss"` と `@plugin "@tailwindcss/typography"` で参照する。CSS ファイル内の参照を knip が追跡できない

- **`textlint` と `textlint-rule-*` / `@textlint-ja/*`（計13パッケージ）**:
  `.textlintrc` からのみ参照される。npm script も CI ジョブも持たず（実行は VS Code 拡張経由）knip からは未使用に見えるが、アンインストールすると textlint が動かなくなる
