/**
 * Slack へ通知するのは、人が記事かコードを直す必要のある失敗だけに絞る。
 * それ以外は呼び出し側が console に出し、Workers Observability で確認する
 */

const isTransientStatus = (status: number): boolean =>
  status === 408 || status === 429 || status >= 500

/**
 * リンクカードの OGP 取得失敗を通知するか判定する
 * @param status - オリジンの HTTP ステータス。fetch 自体の失敗（タイムアウト等）では undefined
 * @returns リンク切れ（404 / 410）のとき true。403 は bot 対策や Cloudflare の egress IP 判定によるもので記事側では直せないため通知しない
 */
export const shouldAlertOgpFailure = (status: number | undefined): boolean =>
  status === 404 || status === 410

/**
 * Creators API の HTTP エラーを通知するか判定する
 * @param status - トークンエンドポイントまたは getItems の HTTP ステータス
 * @returns レート制限・サーバーエラー以外（認証失敗・リクエスト不正）のとき true
 */
export const shouldAlertCreatorsApiStatus = (status: number): boolean =>
  !isTransientStatus(status)
