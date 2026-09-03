---
paths:
  - "knip.json"
---

# knip.json の entry / ignoreDependencies について

意図的な設定であり、崩すと `pnpm lint:unused` が exit 1 になるか、逆に未使用コードを検出できなくなる。

`ignore` の4パターンについて Configuration hints が出るが、基準状態の exit code は 0。このヒントを解消しようとしなくてよい。

## entry

knip は entry ファイルから import を辿って到達したファイルだけをモジュールグラフに載せる。到達しなかったファイルは Unused files として報告され、そのファイルの import 先は辿られない。加えて entry ファイル自体の export は既定（`includeEntryExports: false`）で未使用判定の対象外になる。

このため entry にディレクトリ全体を指定すると、配下の未使用 export が永久に報告されなくなる。以前は `src/server/**/*.{ts,tsx}` を entry に入れており、API ルート廃止後に到達不能となった `transformers.ts` と `validators.ts` の未使用関数がこの指定で隠れていた。ディレクトリ単位で entry を広げるのではなく、実際の入口ファイルを列挙する。

`src/components/mdx/` の3ファイル（`Amzn.astro`, `LinkCard.astro`, `SimpleLinkCard.astro`）を entry に入れているのはこのため。自作 Vite プラグイン `src/plugins/mdx-auto-import.ts` が `astro.config.ts` の `mdxAutoImport([...])` の指定に従って全 MDX へ import 文を注入するが、knip はこのプラグインを解釈できず、かつ注入先の `src/content/**` は `ignore` 対象のため、他に到達経路がない。この3ファイルが、テストを除いた本番コード側から `src/server/` 配下（`amazonAdapter.createAmazonAdapter` など、テストが import していない export を含む）へ到達する唯一の経路になっている。

`mdxAutoImport` の対象を増減したときは entry も同じ内容にする。対象コンポーネントから import される `AmznServer.astro` / `LinkCardServer.astro` / `cardStyles.ts` / `icons/*.astro` は import で辿れるので entry へ足さない。同様に `PositiveBox.astro` / `NegativeBox.astro` は `src/pages/post/[...slug].astro` と `src/pages/page/[slug].astro` の `<Content components={{...}}>` から渡す形なので指定不要。

knip のプラグインが追加する entry もある。Astro プラグインが `src/pages/**` と `src/content.config.ts` を、Wrangler プラグインが `wrangler.jsonc` の `main`（`src/worker.ts`）を、Vitest プラグインが `**/*.test.ts` を entry として登録する。テストファイルが entry になるため、テストからのみ import される export は `pnpm lint:unused`（オプションなしの `knip`）では未使用と判定されない。テスト専用になったコードを洗い出す場合は `knip --production` で test entry を外す。

## ignoreDependencies

- `cloudflare`:
  `import { env } from "cloudflare:workers"` を knip が `cloudflare` パッケージへの参照と解釈する。実体は Workers ランタイム組み込みで package.json には存在しない。除外を外すと Unlisted dependencies として複数ファイル分報告される

- `tailwindcss`, `@tailwindcss/typography`:
  Tailwind v4 では `src/styles/global.css` の `@import "tailwindcss"` と `@plugin "@tailwindcss/typography"` で参照する。CSS ファイル内の参照を knip が追跡できない

- `textlint` と `textlint-rule-*` / `@textlint-ja/*`（計13パッケージ）:
  `.textlintrc` からのみ参照される。npm script も CI ジョブも持たず（実行は VS Code 拡張経由）knip からは未使用に見えるが、アンインストールすると textlint が動かなくなる
