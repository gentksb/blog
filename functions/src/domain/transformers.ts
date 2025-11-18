/**
 * API レスポンス用の純粋な変換関数群
 * 副作用なしでデータを変換する関数を提供
 */

import type { AmazonItemsResponse } from "amazon-paapi"
import type { OgpData } from "@type/ogpData-type"

/**
 * 適切なヘッダーを持つ標準化されたAmazon APIレスポンスを作成
 * @param productData - レスポンスにラップするAmazon商品データ
 * @returns JSONデータと適切なヘッダーを持つResponseオブジェクト
 */
export const createAmazonResponse = (
  productData: AmazonItemsResponse
): Response => {
  return new Response(JSON.stringify(productData), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=86400",
      "x-robots-tag": "noindex"
    }
  })
}

/**
 * 無効なASIN用のエラーレスポンスを作成
 * @param asin - エラーの原因となった無効なASIN
 * @returns エラーメッセージを含むResponseオブジェクト
 */
export const createInvalidAsinResponse = (asin: string | null): Response => {
  const errorMsg = `Invalid ASIN format: ${asin}`
  return new Response(errorMsg, { status: 400 })
}

// === OGP API用変換関数 ===

/**
 * OGPデータから標準化されたJSONレスポンスを作成
 * @param ogpData - OGPメタデータまたはJSON文字列
 * @returns 適切なヘッダーを持つOGPレスポンス
 */
export const createOgpResponse = (ogpData: OgpData | string): Response => {
  const bodyString =
    typeof ogpData === "string" ? ogpData : JSON.stringify(ogpData)

  return new Response(bodyString, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "X-Robots-Tag": "noindex",
      "cache-control": "public, max-age=86400"
    }
  })
}

/**
 * URLパラメータが不足している場合のエラーレスポンスを作成
 * @returns 400エラーレスポンス
 */
export const createMissingUrlParameterResponse = (): Response => {
  return new Response(JSON.stringify({ error: "URL parameter is required" }), {
    status: 400,
    headers: { "content-type": "application/json" }
  })
}

/**
 * OGPデータ取得エラー用のレスポンスを作成
 * @returns 500エラーレスポンス
 */
export const createOgpFetchErrorResponse = (): Response => {
  return new Response(JSON.stringify({ error: "Failed to fetch OGP data" }), {
    status: 500,
    headers: { "content-type": "application/json" }
  })
}

// === セキュリティミドルウェア用変換関数 ===

/**
 * セキュリティミドルウェア用のForbiddenレスポンスを作成
 * @returns 403エラーレスポンス
 */
export const createForbiddenResponse = (): Response => {
  return new Response("Forbidden", { status: 403 })
}

// === OG画像生成用変換関数 ===

/**
 * OG画像生成エラー用のレスポンスを作成
 * @returns 500エラーレスポンス
 */
export const createOgImageErrorResponse = (): Response => {
  return new Response(null, {
    status: 500,
    statusText: "Internal Server Error"
  })
}

// === 共通エラーレスポンス ===

/**
 * Method Not Allowed エラーレスポンスを作成
 * @returns 405エラーレスポンス
 */
export const createMethodNotAllowedResponse = (): Response => {
  return new Response("Method Not Allowed", { status: 405 })
}
