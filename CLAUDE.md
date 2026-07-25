# 幻想サイクル（Genso Cycle）ブログ

Astro + Cloudflare Workers（Static Assets + KV）で動く自転車ブログ。記事は `src/content/post/<年>/<月>/*.mdx`。
フレームワーク・依存のバージョンは `package.json`、Workers 側の構成は `wrangler.jsonc` が正。

React は `src/components/jsx/share.tsx` と `StickyToc.tsx` の 2 つだけ。他は Astro コンポーネントで実装する。

## コマンド

- `pnpm dev` — workerd（Miniflare）上で起動。KV バインディングもローカルシミュレーションされる
- `pnpm dev:cf` — `pnpm build` 後に `dist/server/wrangler.json` で serve。本番ビルドの確認用
- `pnpm test:light` — シークレット不要。Claude Code Web サンドボックスでは常にこちらを使う
- `pnpm test` — `test/services` を含み実 Amazon API を叩く。`PARTNER_TAG` / `CREATORS_CREDENTIAL_*` が必要で CI（lint-test.yml）専用
- `pnpm lint:unused` — knip。`git push` 前に必須

Prettier は Edit / Write の PostToolUse フック（`.claude/settings.json`）で自動実行されるので手動実行は不要。`pnpm lint` は Prettier のみで、textlint は npm script を持たず VS Code 拡張から実行される。記事 MDX（`src/content/post`）は `.prettierignore` 対象で整形されない。

## 実装の注意点

### 記事 MDX の拡張記法

記事側に import は書かない。記法は 2 系統ある。

- JSX 記法（`<LinkCard>` `<Amzn>` `<SimpleLinkCard>`）: `src/plugins/mdx-auto-import.ts` が全 MDX へ import 文を注入する。対象一覧は `astro.config.ts` の `mdxAutoImport([...])` が正。増やすときは `knip.json` の `ignoreFiles` も更新する
- コンテナディレクティブ記法（`:::positive` / `:::negative`）: satteri の `features.directive` が解析し、`src/plugins/satteri-directive-components.ts` の `DIRECTIVE_TO_COMPONENT` がディレクティブ名をコンポーネント名へ変換する。対応表はこのファイルが正で、装飾は変換先の `.astro` が持つ

記事本文で `<PositiveBox>` / `<NegativeBox>` を JSX として書くことはしない（既存記事の使用箇所はすべてディレクティブ記法）。

MDX から `server:defer` 付きの Astro コンポーネントを直接使えないため、`LinkCard.astro` / `Amzn.astro` はラッパーで、KV と外部 API にアクセスする実体は `LinkCardServer.astro` / `AmznServer.astro`。PAAPI データは KV に 24 時間 TTL でキャッシュ。

### Cloudflare Workers

- 環境変数は `import { env } from "cloudflare:workers"`。`Astro.locals.runtime.env` は廃止済みで使わない
- ローカル開発のシークレットは `.dev.vars` に置く。必要なキーの正規定義は `wrangler.jsonc` の `secrets.required`
- Image Service は `WORKERS_CI_BRANCH === "master"` のときだけ有効（プレビュードメインでは `cdn-cgi/image` が 404 になるため）
- vitest はカスタム Worker エントリを読み込めないため、テストは `main` を持たない `wrangler.test.jsonc` を参照する。`wrangler.jsonc` のバインディングを変えたら両方同期する

### AIエージェント向け Markdown 配信

`src/worker.ts` が `cf.verifiedBotCategory` / UA / `Accept: text/markdown` で AI エージェントを判定し、`/post/<slug>/` を SSR エンドポイント `/post/<slug>.md`（`src/pages/post/[...slug].md.ts`）へ内部リライトする。`wrangler.jsonc` の `assets.run_worker_first: ["/post/*"]` が前提。

### タグと URL

`src/content.config.ts` の tags は `z.string().array().min(1)` で enum 検証がない。`src/pages/tag/[tag]/[page].astro` が全記事からタグを集めてページを生成するため、表記を間違えると孤立した `/tag/*` ページが静的生成される。タグは既存記事の frontmatter にある表記から選び、新しいタグを勝手に追加しない。

レガシー URL（`/category/*`, `/categories/*`, `/search/label/*`、旧 Blogger の `.html`）のリダイレクトは `public/_redirects`。

## デプロイと自動化

- デプロイは GitHub リポジトリ連携で Cloudflare が実行。ローカルから `wrangler deploy` はしない
- 週次の依存更新ルーチンは `automation/dependency-update.md`。`.claude/` 配下に置くと許可ダイアログでルーチンが停止するため `automation/` に置いている
- `knip.json` の除外設定を触る際の判断材料は `.claude/rules/knip.md`（`paths` 指定で自動読み込み）
