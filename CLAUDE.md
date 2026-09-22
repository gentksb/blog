# 幻想サイクル（Genso Cycle）ブログ

Astro + Cloudflare Workers（Static Assets + KV）で動く自転車ブログ。記事は `src/content/post/<年>/<月>/*.mdx`。
フレームワーク・依存のバージョンは `package.json`、Workers側の構成は `wrangler.jsonc` が正。

Reactは `src/components/jsx/share.tsx` と `StickyToc.tsx` の2つだけ。他はAstroコンポーネントで実装する。

## コマンド

- `pnpm dev` — workerd（Miniflare）上で起動。KVバインディングもローカルシミュレーションされる
- `pnpm dev:cf` — `pnpm build` 後に `dist/server/wrangler.json` でserve。本番ビルドの確認用
- `pnpm test:light` — シークレット不要。`*.credentialed.test.ts` だけを除外して残り全部を走らせる。Claude Code Webサンドボックスでは常にこちらを使う
- `pnpm test` — `*.credentialed.test.ts` を含み実Amazon APIを叩く。`PARTNER_TAG` / `CREATORS_CREDENTIAL_*` が必要でCI（lint-test.yml）専用。実APIや認証情報を要するテストを追加する場合はファイル名へ `.credentialed.test.ts` を付ける
- `pnpm typecheck` — `astro check`（`@astrojs/check`）。`.astro` / `.ts` / `.tsx` を横断して型検査する
- `pnpm lint:unused` — knip。`git push` 前に必須

PrettierはEdit / WriteのPostToolUseフック（`.claude/settings.json`）で自動実行されるので手動実行は不要。`pnpm lint` はPrettierのみで、textlintはnpm scriptを持たずVS Code拡張から実行される。記事MDX（`src/content/post`）は `.prettierignore` 対象で整形されない。`pnpm typecheck` はターン終了時のStopフック（`.claude/settings.json`）で自動実行されるため、こちらも手動実行は基本不要。

## 実装の注意点

### 記事 MDX の拡張記法

記事側にimportは書かない。記法は2通り。

- JSX記法（`<LinkCard>` `<Amzn>` `<SimpleLinkCard>`）: `src/plugins/mdx-auto-import.ts` が全MDXへimport文を注入する。対象一覧は `astro.config.ts` の `mdxAutoImport([...])` が正。増やすときは `knip.json` の `entry` も更新する
- コンテナディレクティブ記法（`:::positive` / `:::negative`）: 定義は `src/lib/directives.ts` の `DIRECTIVES` が単一の正で、コンポーネント名とMarkdown配信時の引用プレフィックスを持つ。satteriの `features.directive` が解析し、`src/plugins/satteri-directive-components.ts` が `DIRECTIVES` を引いてJSXノードへ変換、`src/pages/post/[...slug].astro` と `src/pages/page/[slug].astro` の `<Content components={{...}}>` がコンポーネントを解決する

記事本文で `<PositiveBox>` / `<NegativeBox>` をJSXとして書くことはしない。ディレクティブを追加するときは `DIRECTIVES` へ1エントリ足し、レンダリング用の `.astro` を作って両方の `components` マップへ渡す。マップへの追加を忘れるとビルドが `Expected component ... to be defined` で落ちる。`test/unit/contentLint.test.ts` が記事の `:::` 名を `DIRECTIVES` と突き合わせ、`test/domain/postToMarkdown.test.ts` が全エントリのMarkdown変換を検証する。

MDXから `server:defer` 付きのAstroコンポーネントを直接使えないため、`LinkCard.astro` / `Amzn.astro` はラッパーで、KVと外部APIにアクセスする実体は `LinkCardServer.astro` / `AmznServer.astro`。PAAPIデータはKVに24時間TTLでキャッシュ。

### Cloudflare Workers

- vitestはカスタムWorkerエントリを読み込めないため、テストは `main` を持たない `wrangler.test.jsonc` を参照する。`wrangler.jsonc` のバインディングを変えたら両方同期する。機能開発の際、アップデートでこのワークアラウンドが不要になっていないか毎回確認する
- Astroのセッション機能は使わないため `astro.config.ts` で `session: false` を指定している（astro 7.2.0 / `@astrojs/cloudflare` 14.2.0以降で有効）。これによりアダプタはSESSION KVバインディングを生成 `wrangler.json` へ注入せず、デプロイ時のKV自動プロビジョニングも起きず、セッションランタイムがWorkerバンドルから外れる
- `wrangler.jsonc` の `placement.region: "aws:ap-northeast-1"` で、Workerのfetchハンドラを東京近傍のデータセンターで実行している。Workerはリクエストを受けたcoloで動き、subrequestもそのcoloから出る。そのため米国・欧州のcoloでOGPを取得すると、Yahoo! JAPANの短縮URL（4〜5ホップのリダイレクト）が1ホップ0.5〜2.4秒かかってタイムアウトしたり、500や403（EEA・英国での提供停止）が返ったりしていた。placementはfetchハンドラ全てに適用されるので、国外からの `/post/*` とServer Islandsも東京経由で処理される。`placement.mode: "smart"` は採らない。複数拠点からの安定したトラフィックがないと配置判定されず、1% のリクエストは転送されないため

### AIエージェント向け Markdown 配信

`src/worker.ts` が `cf.verifiedBotCategory` / UA / `Accept: text/markdown` でAIエージェントを判定し、`/post/<slug>/` をSSRエンドポイント `/post/<slug>.md`（`src/pages/post/[...slug].md.ts`）へ内部リライトする。`wrangler.jsonc` の `assets.run_worker_first: ["/post/*"]` が前提。

MDX → Markdownの変換ロジックは `src/lib/postToMarkdown.ts`。レンダリング経路とは別実装なので、記事の拡張記法を増やしたらここも追随させる。

### タグと URL

`src/content.config.ts` のtagsは `z.string().array().min(1)` でenum検証がない。`src/pages/tag/[tag]/[page].astro` が全記事からタグを集めてページを生成するため、表記を間違えると孤立した `/tag/*` ページが静的生成される。タグは既存記事のfrontmatterにある表記から選び、新しいタグを勝手に追加しない。

レガシー URL（`/category/*`, `/categories/*`, `/search/label/*`、旧Bloggerの `.html`）のリダイレクトは `public/_redirects`。

## デプロイと自動化

- デプロイはGitHubリポジトリ連携でCloudflareが実行。ローカルから `wrangler deploy` はしない
- 週次の依存更新ルーチンは `automation/dependency-update.md`。`.claude/` 配下に置くと許可ダイアログでルーチンが停止するため `automation/` に置いている
- `knip.json` の除外設定を触る際の判断材料は `.claude/rules/knip.md`（`paths` 指定で自動読み込み）
