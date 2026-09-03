import { afterEach, describe, expect, test, vi } from "vitest"
import { postLogToSlack } from "../../src/server/services/postLogToSlack"

// hooks.slack.com ではなく予約 TLD (.invalid) を使う。fetch のスタブが外れた場合でも
// 実際の Slack へ POST されず、DNS 解決失敗としてテストが落ちるようにするため。
const webhookUrl =
  "https://hooks.slack.invalid/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"

const stubFetch = (impl: typeof fetch) => {
  const fetchMock = vi.fn(impl)
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("postLogToSlack", () => {
  test("webhook URL が空文字なら送信せず reject する", async () => {
    const fetchMock = stubFetch(async () => new Response(null))

    await expect(postLogToSlack("test message", "")).rejects.toThrow(
      "SLACK_WEBHOOK_URL is not defined"
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("webhook URL が undefined なら送信せず reject する", async () => {
    const fetchMock = stubFetch(async () => new Response(null))

    await expect(
      postLogToSlack("test message", undefined as unknown as string)
    ).rejects.toThrow("SLACK_WEBHOOK_URL is not defined")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("URL として解釈できない値なら送信せず reject する", async () => {
    const fetchMock = stubFetch(async () => new Response(null))

    await expect(
      postLogToSlack("test message", "not-a-valid-url")
    ).rejects.toThrow("Invalid SLACK_WEBHOOK_URL: not-a-valid-url")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("有効な webhook URL へメッセージを JSON で POST する", async () => {
    const fetchMock = stubFetch(async () => new Response(null, { status: 200 }))

    await expect(
      postLogToSlack("string message", webhookUrl)
    ).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [calledUrl, init] = fetchMock.mock.calls[0]
    expect(calledUrl).toBe(webhookUrl)
    expect(init?.method).toBe("POST")
    expect(JSON.parse(init?.body as string)).toEqual({ text: "string message" })
  })

  test("fetch が失敗したら元のエラー内容を含めて reject する", async () => {
    stubFetch(async () => {
      throw new Error("network unreachable")
    })

    await expect(postLogToSlack("error message", webhookUrl)).rejects.toThrow(
      "network unreachable"
    )
  })
})
