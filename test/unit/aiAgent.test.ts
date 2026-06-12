import { expect, test } from "vitest"
import { isAiAgentRequest, postMarkdownPathFor } from "../../src/lib/aiAgent"

// === isAiAgentRequest ===

test("ClaudeBot の実UA は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent:
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      accept: "text/html",
      verifiedBotCategory: undefined
    })
  ).toBe(true)
})

test("GPTBot は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent: "GPTBot/1.1 (+https://openai.com/gptbot)",
      accept: "text/html",
      verifiedBotCategory: undefined
    })
  ).toBe(true)
})

test("Accept: text/markdown,text/html は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      accept: "text/markdown,text/html",
      verifiedBotCategory: undefined
    })
  ).toBe(true)
})

test("verifiedBotCategory が AI Assistant は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent: "Mozilla/5.0 (compatible; SomeBot/1.0)",
      accept: "text/html",
      verifiedBotCategory: "AI Assistant"
    })
  ).toBe(true)
})

test("verifiedBotCategory が AI Crawler は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent: null,
      accept: null,
      verifiedBotCategory: "AI Crawler"
    })
  ).toBe(true)
})

test("verifiedBotCategory が AI Search は AI と判定される", () => {
  expect(
    isAiAgentRequest({
      userAgent: null,
      accept: null,
      verifiedBotCategory: "AI Search"
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

test("null/undefined 入力は AI と判定されない", () => {
  expect(
    isAiAgentRequest({
      userAgent: null,
      accept: null,
      verifiedBotCategory: undefined
    })
  ).toBe(false)
})

test("空文字 UA + 空文字 accept は AI と判定されない", () => {
  expect(
    isAiAgentRequest({
      userAgent: "",
      accept: "",
      verifiedBotCategory: undefined
    })
  ).toBe(false)
})

// === postMarkdownPathFor ===

test("/post/2013/12/jetfly-tl/ → /post/2013/12/jetfly-tl.md", () => {
  expect(postMarkdownPathFor("/post/2013/12/jetfly-tl/")).toBe(
    "/post/2013/12/jetfly-tl.md"
  )
})

test("/post/2013/12/jetfly-tl（末尾スラッシュなし）→ /post/2013/12/jetfly-tl.md", () => {
  expect(postMarkdownPathFor("/post/2013/12/jetfly-tl")).toBe(
    "/post/2013/12/jetfly-tl.md"
  )
})

test("/post/ → null", () => {
  expect(postMarkdownPathFor("/post/")).toBeNull()
})

test("/post → null", () => {
  expect(postMarkdownPathFor("/post")).toBeNull()
})

test("/post/2013/12/jetfly-tl/twitter-og.png → null（最終セグメントに . を含む）", () => {
  expect(
    postMarkdownPathFor("/post/2013/12/jetfly-tl/twitter-og.png")
  ).toBeNull()
})

test("/post/2013/12/jetfly-tl.md → null（最終セグメントに . を含む）", () => {
  expect(postMarkdownPathFor("/post/2013/12/jetfly-tl.md")).toBeNull()
})

test("/ → null", () => {
  expect(postMarkdownPathFor("/")).toBeNull()
})

test("/tag/ROAD/1/ → null", () => {
  expect(postMarkdownPathFor("/tag/ROAD/1/")).toBeNull()
})

test("単一セグメント記事 /post/my-article/ → /post/my-article.md", () => {
  expect(postMarkdownPathFor("/post/my-article/")).toBe("/post/my-article.md")
})
