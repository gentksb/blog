/**
 * Amazon APIレスポンス用の純粋な変換関数群
 * 副作用なしでデータを変換する関数を提供
 */

import type { AmazonItemsResponse } from "amazon-paapi"

/**
 * 適切なヘッダーを持つ標準化されたAmazon APIレスポンスを作成
 * @param productData - レスポンスにラップするAmazon商品データ
 * @returns JSONデータと適切なヘッダーを持つResponseオブジェクト
 */
export const createAmazonResponse = (productData: AmazonItemsResponse): Response => {
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