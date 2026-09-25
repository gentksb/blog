import { describe, expect, test } from "vitest"
import {
  shouldAlertCreatorsApiStatus,
  shouldAlertOgpFailure
} from "../../src/server/domain/alertPolicy"

describe("shouldAlertOgpFailure", () => {
  test.each([404, 410])("リンク切れ（HTTP %i）は通知する", (status) => {
    expect(shouldAlertOgpFailure(status)).toBe(true)
  })

  test.each([403, 429, 500, 503])(
    "記事側で直せない HTTP %i は通知しない",
    (status) => {
      expect(shouldAlertOgpFailure(status)).toBe(false)
    }
  )

  test("タイムアウト等で status が無い失敗は通知しない", () => {
    expect(shouldAlertOgpFailure(undefined)).toBe(false)
  })
})

describe("shouldAlertCreatorsApiStatus", () => {
  test.each([400, 401, 403, 404])(
    "認証失敗・リクエスト不正（HTTP %i）は通知する",
    (status) => {
      expect(shouldAlertCreatorsApiStatus(status)).toBe(true)
    }
  )

  test.each([408, 429, 500, 503])(
    "時間をおけば回復する HTTP %i は通知しない",
    (status) => {
      expect(shouldAlertCreatorsApiStatus(status)).toBe(false)
    }
  )
})
