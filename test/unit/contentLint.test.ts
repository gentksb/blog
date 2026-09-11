import { expect, test } from "vitest"
import { DIRECTIVES, isDirectiveName } from "../../src/lib/directives"
import { postToMarkdown } from "../../src/lib/postToMarkdown"
import {
  allMdxSources,
  postMdxSources,
  singlePageMdxSources,
  stripCodeFences,
  stripFrontmatter
} from "../helpers/mdxSources"

// glob が空振りすると以下の全記事検査が中身ゼロのまま緑になるため、最初に件数を確認する
test("post / singlePage の MDX を両方読み込めている", () => {
  expect(Object.keys(postMdxSources).length).toBeGreaterThan(0)
  expect(Object.keys(singlePageMdxSources).length).toBeGreaterThan(0)
})

test("LinkCardのprop誤記（小文字linkurl=）がMDXコンテンツに存在しない", () => {
  const offenders = Object.entries(postMdxSources)
    .filter(([, source]) => /\blinkurl=/.test(source))
    .map(([path]) => path)
  expect(offenders).toEqual([])
})

// satteri は字下げ・コロン4個以上・ラベル・属性も container directive として
// 受け付けるため、開始行の検出は緩いパターンで行う。終了行には名前がないので
// このパターンとは重複しない
const directiveOpenerPattern = /^[ \t]*:{3,}([A-Za-z][\w-]*)/gm

test("MDXで使われているディレクティブ名が DIRECTIVES に定義されている", () => {
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    [...stripCodeFences(source).matchAll(directiveOpenerPattern)]
      .filter(([, name]) => !isDirectiveName(name))
      .map(([line]) => `${path}: ${JSON.stringify(line)}`)
  )
  expect(offenders).toEqual([])
})

// isDirectiveName が `in` ではなく Object.hasOwn を使う理由。
// プロトタイプ由来の名前を通すと DIRECTIVES[name] が undefined になり変換時に落ちる
test("Object.prototype 由来のプロパティ名はディレクティブ名として拒否される", () => {
  expect(isDirectiveName("toString")).toBe(false)
  expect(isDirectiveName("warning")).toBe(false)
})

// postToMarkdown はネストと閉じ忘れを変換できない。記法を禁止する代わりに、
// 実際の記事を変換して ::: が残らないことで変換漏れを検出する
test("全MDXを postToMarkdown で変換して ::: が残らない", () => {
  const offenders = Object.entries(allMdxSources)
    .map(([path, source]) => ({
      path,
      markdown: postToMarkdown({
        slug: "test/slug",
        title: "テスト",
        date: new Date("2020-01-01T00:00:00Z"),
        tags: ["TEST"],
        body: stripFrontmatter(source),
        siteUrl: "https://example.com/",
        partnerTag: ""
      })
    }))
    // コードフェンス内の ::: は変換対象外なので除外する
    .filter(({ markdown }) => stripCodeFences(markdown).includes(":::"))
    .map(({ path }) => path)
  expect(offenders).toEqual([])
})

test("PositiveBox / NegativeBox がMDXでJSX記法として書かれていない", () => {
  const componentNames = Object.values(DIRECTIVES).map((d) => d.component)
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    componentNames
      .filter((name) => new RegExp(`<${name}[\\s/>]`).test(source))
      .map((name) => `${path}: <${name}>`)
  )
  expect(offenders).toEqual([])
})
