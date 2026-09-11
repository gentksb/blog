import { expect, test } from "vitest"
import { isAiAgentRequest, postMarkdownPathFor } from "../../src/lib/aiAgent"

// === isAiAgentRequest ===
// 判定は3経路（verifiedBotCategory / Accept / UA パターン）しかないため、経路ごとに1件ずつ検証する

test("既知AIボットの UA は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent:
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      accept: "text/html",
      verifiedBotCategory: undefined
    })
  ).toBe(true)
})

test("Accept に text/markdown を含むと AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      accept: "text/markdown,text/html",
      verifiedBotCategory: undefined
    })
  ).toBe(true)
})

test("Cloudflare の verifiedBotCategory が AI 系なら AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent: "Mozilla/5.0 (compatible; SomeBot/1.0)",
      accept: "text/html",
      verifiedBotCategory: "AI Assistant"
    })
  ).toBe(true)
})

test("Chrome 通常 UA + Accept: text/html は AI と判定されない", () => {
  expect(
    isAiAgentRequest({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      verifiedBotCategory: undefined
    })
  ).toBe(false)
})

test("ヘッダが欠けていても AI と判定されない", () => {
  expect(
    isAiAgentRequest({
      userAgent: null,
      accept: null,
      verifiedBotCategory: undefined
    })
  ).toBe(false)
})

// === postMarkdownPathFor ===

test.each([
  ["/post/2013/12/jetfly-tl/", "/post/2013/12/jetfly-tl.md"],
  // 末尾スラッシュの有無で同じパスへ解決する
  ["/post/2013/12/jetfly-tl", "/post/2013/12/jetfly-tl.md"]
])("%s → %s", (pathname, expected) => {
  expect(postMarkdownPathFor(pathname)).toBe(expected)
})

test.each([
  // /post/ 配下でない
  ["/tag/ROAD/1/"],
  // slug が無い
  ["/post/"],
  // 最終セグメントに . を含む（画像や .md 自身）
  ["/post/2013/12/jetfly-tl/twitter-og.png"]
])("%s → null", (pathname) => {
  expect(postMarkdownPathFor(pathname)).toBeNull()
})
