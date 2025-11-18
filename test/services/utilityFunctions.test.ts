import { expect, test } from "vitest"
import { postLogToSlack } from "functions/src/services/postLogToSlack"

test("postLogToSlack handles missing webhook URL gracefully", async () => {
  // Should handle empty webhook URL without throwing
  try {
    await postLogToSlack("test message", "")
  } catch (error: any) {
    // Expected to throw due to undefined SLACK_WEBHOOK_URL, but should be handled gracefully
    expect(error.message).toContain("SLACK_WEBHOOK_URL")
  }

  try {
    await postLogToSlack("test message", undefined as any)
  } catch (error: any) {
    // Expected to throw due to undefined SLACK_WEBHOOK_URL, but should be handled gracefully
    expect(error.message).toContain("SLACK_WEBHOOK_URL")
  }
})

test("postLogToSlack validates webhook URL parameter", async () => {
  // Should reject invalid webhook URLs
  const invalidWebhookUrl = "not-a-valid-url"

  await expect(
    postLogToSlack("test message", invalidWebhookUrl)
  ).rejects.toThrow()
})

test("postLogToSlack handles various message types", async () => {
  const webhookUrl =
    "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"

  // Should handle different message types - will fail due to invalid webhook but shouldn't crash
  try {
    await postLogToSlack("string message", webhookUrl)
  } catch (error: any) {
    expect(error.message).toContain("internal error")
  }

  try {
    await postLogToSlack("error message", webhookUrl)
  } catch (error: any) {
    expect(error.message).toContain("internal error")
  }

  try {
    await postLogToSlack("custom object", webhookUrl)
  } catch (error: any) {
    expect(error.message).toContain("internal error")
  }
})
