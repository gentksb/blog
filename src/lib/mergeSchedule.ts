const REPO = "gentksb/blog"
const API_BASE = `https://api.github.com/repos/${REPO}`
const WORKFLOW_FILE = "merge-schedule.yml"
const FAIL_LABEL = "merge-schedule-failed"
const RETRY_WINDOW_MS = 30 * 60 * 1000
const HOURLY_TICK_MINUTES = 5

export interface PullRequestSummary {
  number: number
  body: string | null
  labels: { name: string }[]
  head: { repo: { full_name: string } | null }
}

// merge-schedule-action (lib/utils.ts) と同じ正規表現・Date解釈にそろえる。trim しないのも action に合わせるため
export const scheduledDateOf = (body: string | null): Date | undefined => {
  const dateString = body?.match(/(^|\n)\/schedule (.*)/)?.pop()
  if (dateString === undefined) return undefined
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const dueScheduledDates = (
  pulls: PullRequestSummary[],
  now: Date
): Date[] =>
  pulls
    .filter((pr) => pr.head.repo?.full_name === REPO)
    .filter((pr) => pr.labels.every((label) => label.name !== FAIL_LABEL))
    .map((pr) => scheduledDateOf(pr.body))
    .filter((date): date is Date => date !== undefined && date < now)

const isHourlyTick = (now: Date): boolean =>
  now.getUTCMinutes() < HOURLY_TICK_MINUTES

export const shouldDispatch = (dueDates: Date[], now: Date): boolean => {
  if (dueDates.length === 0) return false
  const hasRecent = dueDates.some(
    (date) => now.getTime() - date.getTime() < RETRY_WINDOW_MS
  )
  return hasRecent || isHourlyTick(now)
}

const githubHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "gensobunya-blog-merge-schedule"
})

const fetchOpenPulls = async (
  token: string,
  fetcher: typeof fetch
): Promise<PullRequestSummary[]> => {
  const response = await fetcher(`${API_BASE}/pulls?state=open&per_page=100`, {
    headers: githubHeaders(token)
  })
  if (!response.ok) {
    throw new Error(
      `GitHub pulls API returned ${response.status}: ${await response.text()}`
    )
  }
  return response.json()
}

const dispatchMergeSchedule = async (
  token: string,
  fetcher: typeof fetch
): Promise<void> => {
  const response = await fetcher(
    `${API_BASE}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: githubHeaders(token),
      body: JSON.stringify({ ref: "master" })
    }
  )
  if (!response.ok) {
    throw new Error(
      `GitHub workflow dispatch API returned ${response.status}: ${await response.text()}`
    )
  }
}

interface RunMergeScheduleOptions {
  token: string
  now: Date
  fetcher?: typeof fetch
  notifyError?: (message: string) => Promise<void>
}

export const runMergeSchedule = async ({
  token,
  now,
  fetcher = fetch,
  notifyError
}: RunMergeScheduleOptions): Promise<boolean> => {
  try {
    if (!token) {
      throw new Error("GITHUB_MERGE_SCHEDULE_TOKEN is not defined")
    }
    const pulls = await fetchOpenPulls(token, fetcher)
    if (!shouldDispatch(dueScheduledDates(pulls, now), now)) return false
    await dispatchMergeSchedule(token, fetcher)
    return true
  } catch (e) {
    // 5分毎の起動ごとに通知すると、PAT失効のような継続的な失敗で1日288件になる
    if (isHourlyTick(now)) {
      const message = e instanceof Error ? e.message : String(e)
      await notifyError?.(`Merge Schedule Error\n${message}`).catch(
        console.error
      )
    }
    throw e
  }
}
