/**
 * Cloudflare Workers シークレット環境変数の型定義
 * wrangler secret putで設定するシークレットを型定義
 */

declare global {
  interface Env {
    // Amazon Creators API 認証情報
    CREATORS_CREDENTIAL_ID: string
    CREATORS_CREDENTIAL_SECRET: string

    // Amazon Associates パートナータグ
    PARTNER_TAG: string

    // Slack Webhook URL（エラーログ通知用）
    SLACK_WEBHOOK_URL: string

    // レガシー: PAAPI v5 認証情報（移行期間中に削除予定）
    // PAAPI_ACCESSKEY: string
    // PAAPI_SECRETKEY: string
  }
}

export {}
