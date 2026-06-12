import { expect, test } from "vitest"

// ビルド時(Vite)に全MDXソースを取り込む（workerd内ではfsを使えないため）
const mdxSources = import.meta.glob("../../src/content/post/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

test("MDXコンテンツを1件以上読み込めている", () => {
  expect(Object.keys(mdxSources).length).toBeGreaterThan(0)
})

test("LinkCardのprop誤記（小文字linkurl=）がMDXコンテンツに存在しない", () => {
  const offenders = Object.entries(mdxSources)
    .filter(([, source]) => /\blinkurl=/.test(source))
    .map(([path]) => path)
  expect(offenders).toEqual([])
})
