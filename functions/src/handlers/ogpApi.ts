/**
 * OGP API ハンドラー
 * OGPメタデータの取得とキャッシングを処理
 * 依存性注入を使ったクリーンアーキテクチャにリファクタリング済み
 */

import {
  isValidUrl,
  extractUrlFromRequest,
  validateOgpConfig
} from "../domain/validators"
import {
  createOgpResponse,
  createMissingUrlParameterResponse,
  createOgpFetchErrorResponse,
  createMethodNotAllowedResponse
} from "../domain/transformers"
import {
  createOgpAdapter,
  createOgpKVCacheAdapter,
  createOgpSlackLoggerAdapter,
  createOgpFetcherAdapter,
  type OgpAdapter
} from "../adapters/ogpAdapter"

/**
 * 依存性注入を使ったOGPハンドラーを作成
 * @param adapter - 注入された依存関係を持つOGPアダプター
 * @returns OGP APIリクエスト用のハンドラー関数
 */
export const createOgpHandler = (adapter: OgpAdapter, env: Env) => {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "GET") {
      return createMethodNotAllowedResponse()
    }

    try {
      // URLパラメータを抽出
      const url = extractUrlFromRequest(request)

      // URLパラメータの存在を検証
      if (!url) {
        console.error("Missing URL parameter")
        await adapter.logError("Missing URL parameter", request.url)
        return createMissingUrlParameterResponse()
      }

      // URL形式を検証
      if (!isValidUrl(url)) {
        const errorMsg = `Invalid URL format: ${url}`
        console.error(errorMsg)
        await adapter.logError(errorMsg, request.url)
        return createMissingUrlParameterResponse()
      }

      console.log(`Requested OGP URL: ${url}`)

      // まずキャッシュをチェック
      const cachedData = await adapter.getCached(url)

      if (cachedData) {
        console.log(`OGP KV cache hit for: ${url}`)
        return createOgpResponse(cachedData)
      }

      // 現在のホストを取得
      const currentHost = new URL(request.url).hostname

      // OGPデータを取得
      const ogpData = await adapter.getOgpData(url, env, currentHost)

      // 結果をキャッシュ
      await adapter.cacheResult(url, ogpData)

      console.log(`OGP data cached for: ${url}`)
      return createOgpResponse(ogpData)
    } catch (error) {
      console.error("OGP API error:", error)

      // Slackにエラーをログ
      await adapter.logError(`Error: ${(error as Error).message}`, request.url)

      return createOgpFetchErrorResponse()
    }
  }
}

/**
 * OGPメタデータのGETリクエストを処理
 * 依存関係を作成してハンドラーに委譲するメインエントリーポイント
 */
export async function handleOgpApi(
  request: Request,
  env: Env,
  _ctx: ExecutionContext
): Promise<Response> {
  // HTTPメソッドを先にチェック
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  // 設定を検証
  const config = {
    slackWebhookUrl: env.SLACK_WEBHOOK_URL
  }

  if (!validateOgpConfig(config)) {
    throw new Error("Environment variables are not valid")
  }

  // 依存性注入でアダプターを作成
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const logger = createOgpSlackLoggerAdapter(env.SLACK_WEBHOOK_URL)
  const fetcher = createOgpFetcherAdapter()
  const adapter = createOgpAdapter({ cache, config, logger, fetcher })

  // ハンドラーを作成して実行
  const handler = createOgpHandler(adapter, env)
  return await handler(request)
}

// テスト用に純粋関数をエクスポート
export {
  isValidUrl,
  extractUrlFromRequest,
  validateOgpConfig
} from "../domain/validators"

export {
  createOgpResponse,
  createMissingUrlParameterResponse,
  createOgpFetchErrorResponse
} from "../domain/transformers"
