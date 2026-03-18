// post error log to My Slack channel
export const postLogToSlack = async (
  log: string,
  SLACK_WEBHOOK_URL: string
) => {
  const url = SLACK_WEBHOOK_URL
  if (!url) {
    throw new Error("SLACK_WEBHOOK_URL is not defined")
  }
  if (!URL.canParse(url)) {
    throw new Error(`Invalid SLACK_WEBHOOK_URL: ${url}`)
  }
  const payload = {
    text: log
  }
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error(e)
    throw new Error(String(e))
  }
}
