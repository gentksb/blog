import { describe, expect, test, vi } from "vitest"
import {
  dueScheduledDates,
  runMergeSchedule,
  scheduledDateOf,
  shouldDispatch,
  type PullRequestSummary
} from "../../src/lib/mergeSchedule"

const pr = (
  body: string | null,
  overrides: Partial<PullRequestSummary> = {}
): PullRequestSummary => ({
  number: 1,
  body,
  labels: [],
  head: { repo: { full_name: "gentksb/blog" } },
  ...overrides
})

describe("scheduledDateOf", () => {
  test.each([
    ["/schedule 2026-10-14T22:00:00Z", "2026-10-14T22:00:00.000Z"],
    ["/schedule 2026-10-14T22:00:00.000Z", "2026-10-14T22:00:00.000Z"],
    ["/schedule 2026-10-15T07:00:00.000+09:00", "2026-10-14T22:00:00.000Z"],
    ["/schedule 2026-10-15", "2026-10-15T00:00:00.000Z"],
    ["本文\n/schedule 2026-10-14T22:00:00Z\n続き", "2026-10-14T22:00:00.000Z"]
  ])("行頭の /schedule の日時を読み取る: %s", (body, expected) => {
    expect(scheduledDateOf(body)?.toISOString()).toBe(expected)
  })

  test("行頭以外の /schedule は予約として扱わない", () => {
    expect(
      scheduledDateOf("`/schedule` を使わずに手動でマージする")
    ).toBeUndefined()
  })

  test("解釈できない日時は予約として扱わない", () => {
    expect(scheduledDateOf("/schedule 来週")).toBeUndefined()
  })

  test("本文が null なら予約なし", () => {
    expect(scheduledDateOf(null)).toBeUndefined()
  })
})

describe("dueScheduledDates", () => {
  const now = new Date("2026-10-14T22:05:00Z")

  test("予定時刻を過ぎたPRだけを返す", () => {
    const dates = dueScheduledDates(
      [
        pr("/schedule 2026-10-14T22:00:00Z"),
        pr("/schedule 2026-10-14T23:00:00Z"),
        pr("予約なし")
      ],
      now
    )
    expect(dates.map((d) => d.toISOString())).toEqual([
      "2026-10-14T22:00:00.000Z"
    ])
  })

  test("merge-schedule-failed ラベル付きのPRは除外する", () => {
    expect(
      dueScheduledDates(
        [
          pr("/schedule 2026-10-14T22:00:00Z", {
            labels: [{ name: "merge-schedule-failed" }]
          })
        ],
        now
      )
    ).toEqual([])
  })

  test("フォークからのPRは除外する", () => {
    expect(
      dueScheduledDates(
        [
          pr("/schedule 2026-10-14T22:00:00Z", {
            head: { repo: { full_name: "someone/blog" } }
          }),
          pr("/schedule 2026-10-14T22:00:00Z", { head: { repo: null } })
        ],
        now
      )
    ).toEqual([])
  })
})

describe("shouldDispatch", () => {
  test("期日到来のPRがなければ起動しない", () => {
    expect(shouldDispatch([], new Date("2026-10-14T22:00:00Z"))).toBe(false)
  })

  test("予定時刻から30分未満のPRがあれば毎回起動する", () => {
    expect(
      shouldDispatch(
        [new Date("2026-10-14T22:00:00Z")],
        new Date("2026-10-14T22:25:00Z")
      )
    ).toBe(true)
  })

  test("30分以上経過したPRだけなら毎時最初の5分間だけ起動する", () => {
    const due = [new Date("2026-10-14T22:00:00Z")]
    expect(shouldDispatch(due, new Date("2026-10-14T22:35:00Z"))).toBe(false)
    expect(shouldDispatch(due, new Date("2026-10-14T23:00:00Z"))).toBe(true)
    expect(shouldDispatch(due, new Date("2026-10-14T23:04:59Z"))).toBe(true)
    expect(shouldDispatch(due, new Date("2026-10-14T23:05:00Z"))).toBe(false)
  })
})

describe("runMergeSchedule", () => {
  const now = new Date("2026-10-14T22:05:00Z")

  const mockFetcher = (pulls: PullRequestSummary[], dispatchStatus = 204) =>
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes("/pulls?")) return Response.json(pulls)
      if (url.endsWith("/dispatches") && init?.method === "POST") {
        return new Response(dispatchStatus === 204 ? null : "error", {
          status: dispatchStatus
        })
      }
      return new Response("not found", { status: 404 })
    }) as unknown as typeof fetch & ReturnType<typeof vi.fn>

  test("期日到来のPRがあれば merge-schedule.yml を master で起動する", async () => {
    const fetcher = mockFetcher([pr("/schedule 2026-10-14T22:00:00Z")])

    await expect(runMergeSchedule({ token: "t", now, fetcher })).resolves.toBe(
      true
    )

    const [url, init] = fetcher.mock.calls[1]
    expect(String(url)).toBe(
      "https://api.github.com/repos/gentksb/blog/actions/workflows/merge-schedule.yml/dispatches"
    )
    expect(init?.method).toBe("POST")
    expect(JSON.parse(String(init?.body))).toEqual({ ref: "master" })
    const headers = new Headers(init?.headers)
    expect(headers.get("authorization")).toBe("Bearer t")
    expect(headers.get("user-agent")).toBeTruthy()
  })

  test("期日到来のPRがなければ起動しない", async () => {
    const fetcher = mockFetcher([pr("/schedule 2026-10-15T22:00:00Z")])

    await expect(runMergeSchedule({ token: "t", now, fetcher })).resolves.toBe(
      false
    )
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  describe("失敗時", () => {
    const hourlyTick = new Date("2026-10-14T22:01:00Z")

    test("APIが非2xxを返したら、毎時最初の5分間なら通知して例外を投げる", async () => {
      const fetcher = mockFetcher([pr("/schedule 2026-10-14T21:50:00Z")], 401)
      const notifyError = vi.fn(async () => {})

      await expect(
        runMergeSchedule({ token: "t", now: hourlyTick, fetcher, notifyError })
      ).rejects.toThrow("401")
      expect(notifyError).toHaveBeenCalledWith(expect.stringContaining("401"))
    })

    test("毎時最初の5分間以外の失敗は通知せず例外だけ投げる", async () => {
      const fetcher = mockFetcher([pr("/schedule 2026-10-14T22:00:00Z")], 401)
      const notifyError = vi.fn(async () => {})

      await expect(
        runMergeSchedule({ token: "t", now, fetcher, notifyError })
      ).rejects.toThrow("401")
      expect(notifyError).not.toHaveBeenCalled()
    })

    test("トークン未設定なら例外を投げ、APIを呼ばない", async () => {
      const fetcher = mockFetcher([])
      const notifyError = vi.fn(async () => {})

      await expect(
        runMergeSchedule({ token: "", now: hourlyTick, fetcher, notifyError })
      ).rejects.toThrow("GITHUB_MERGE_SCHEDULE_TOKEN")
      expect(notifyError).toHaveBeenCalledOnce()
      expect(fetcher).not.toHaveBeenCalled()
    })
  })
})
