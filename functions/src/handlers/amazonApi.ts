/**
 * Amazon商品API ハンドラー
 * PA-APIを通じたAmazon商品情報の取得とキャッシングを処理
 * 依存性注入を使ったクリーンアーキテクチャにリファクタリング済み
 */

import {
  isValidAsin,
  extractAsinFromUrl,
  validateAmazonConfig
} from "../domain/validators"
import { createAmazonResponse } from "../domain/transformers"
import {
  createAmazonAdapter,
  createKVCacheAdapter,
  createSlackLoggerAdapter,
  type AmazonAdapter
} from "../adapters/amazonAdapter"

/**
 * 依存性注入を使ったAmazonハンドラーを作成
 * @param adapter - 注入された依存関係を持つAmazonアダプター
 * @returns Amazon APIリクエスト用のハンドラー関数
 */
export const createAmazonHandler = (adapter: AmazonAdapter) => {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 })
    }

    try {
      // URLパスからASINを抽出
      const asin = extractAsinFromUrl(request.url)

      // ASIN形式を検証
      if (!asin || !isValidAsin(asin)) {
        const errorMsg = `Invalid ASIN format: ${asin}`
        console.error(errorMsg)

        await adapter.logError(errorMsg, request.url)
        throw new Error("asin is't valid.")
      }

      console.log(`Requested ASIN: ${asin}`)

      // まずキャッシュをチェック
      const cachedData = await adapter.getCached(asin)

      if (cachedData) {
        console.log(`Amazon PA-API cache hit for ASIN: ${asin}`)
        return createAmazonResponse(cachedData)
      }

      // PA-APIから商品データを取得
      const productData = await adapter.getProductInfo(asin)

      // 結果をキャッシュ
      await adapter.cacheResult(asin, productData)

      console.log(`Amazon product data cached for ASIN: ${asin}`)
      return createAmazonResponse(productData)
    } catch (error) {
      console.error("Amazon API error:", error)

      // Slackにエラーをログ
      await adapter.logError(
        `Error: ${(error as Error).message}\nASIN: ${extractAsinFromUrl(request.url) || "N/A"}`,
        `Access Source(referer): ${request.headers.get("referer")}`
      )

      throw error
    }
  }
}

/**
 * Amazon商品情報のGETリクエストを処理
 * 依存関係を作成してハンドラーに委譲するメインエントリーポイント
 */
export async function handleAmazonApi(
  request: Request,
  env: Env,
  _ctx: ExecutionContext
): Promise<Response> {
  // 設定を検証
  const config = {
    accessKey: env.PAAPI_ACCESSKEY,
    secretKey: env.PAAPI_SECRETKEY,
    partnerTag: env.PARTNER_TAG
  }

  if (!validateAmazonConfig(config)) {
    throw new Error("Environment variables are not valid")
  }

  // 依存性注入でアダプターを作成
  const cache = createKVCacheAdapter(env.PAAPI_DATASTORE)
  const logger = createSlackLoggerAdapter(env.SLACK_WEBHOOK_URL)
  const adapter = createAmazonAdapter({ cache, config, logger })

  // ハンドラーを作成して実行
  const handler = createAmazonHandler(adapter)
  return await handler(request)
}

// テスト用に純粋関数をエクスポート
export {
  isValidAsin,
  extractAsinFromUrl,
  validateAmazonConfig
} from "../domain/validators"

export { createAmazonResponse } from "../domain/transformers"
