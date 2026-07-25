import { expect, test } from "vitest"
import { DIRECTIVES } from "../../src/lib/directives"

// ビルド時(Vite)に全MDXソースを取り込む（workerd内ではfsを使えないため）
const mdxSources = import.meta.glob("../../src/content/post/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

// ディレクティブは post / singlePage 双方のレンダリング経路で解決されるため両方を対象にする
const allMdxSources = {
  ...mdxSources,
  ...(import.meta.glob("../../src/content/singlePage/**/*.mdx", {
    query: "?raw",
    import: "default",
    eager: true
  }) as Record<string, string>)
}

test("MDXコンテンツを1件以上読み込めている", () => {
  expect(Object.keys(mdxSources).length).toBeGreaterThan(0)
})

test("LinkCardのprop誤記（小文字linkurl=）がMDXコンテンツに存在しない", () => {
  const offenders = Object.entries(mdxSources)
    .filter(([, source]) => /\blinkurl=/.test(source))
    .map(([path]) => path)
  expect(offenders).toEqual([])
})

test("MDXで使われているコンテナディレクティブが全て DIRECTIVES に定義されている", () => {
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    [...source.matchAll(/^:::([a-z][a-z0-9-]*)/gm)]
      .map((match) => match[1])
      .filter((name) => !(name in DIRECTIVES))
      .map((name) => `${path}: :::${name}`)
  )
  expect(offenders).toEqual([])
})

test("PositiveBox / NegativeBox がMDXでJSX記法として書かれていない", () => {
  const componentNames = Object.values(DIRECTIVES).map((d) => d.component)
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    componentNames
      .filter((name) => new RegExp(`<${name}[\\s>]`).test(source))
      .map((name) => `${path}: <${name}>`)
  )
  expect(offenders).toEqual([])
})
