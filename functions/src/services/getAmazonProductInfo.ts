/**
 * Amazon Creators API を使用した商品情報取得サービス
 * PAAPI v5 からの移行版
 */

import type { AmazonItemsResponse } from "amazon-paapi"
import { createAuthorizationHeader, getOAuthToken } from "./creatorsApiAuth"

// Creators API エンドポイント
const CREATORS_API_ENDPOINT = "https://creatorsapi.amazon/getitems"

// Creators API バージョン（日本リージョン: 2.3）
const API_VERSION = "2.3"

/**
 * Creators API用のリクエストボディ型（camelCase）
 */
interface CreatorsApiRequestBody {
  itemIds: string[]
  itemIdType: "ASIN"
  condition: "New" | "Used" | "Collectible" | "Refurbished" | "Any"
  resources: string[]
  partnerTag: string
  partnerType: "Associates"
  marketplace: string
}

export const getAmazonProductInfo = async (
  asin: string,
  credentialId: string,
  credentialSecret: string,
  partnerTag: string,
  kv?: KVNamespace
): Promise<AmazonItemsResponse> => {
  // パラメータ検証
  if (
    typeof credentialId !== "string" ||
    typeof credentialSecret !== "string" ||
    typeof partnerTag !== "string"
  ) {
    throw new Error("Environment variables are not valid")
  }
  if (asin.length !== 10) {
    throw new Error("ASIN is not valid: invalid length")
  }

  // OAuthトークンを取得
  const token = await getOAuthToken(credentialId, credentialSecret, kv)

  // リクエストボディを構築（Creators API形式: camelCase）
  const body: CreatorsApiRequestBody = {
    itemIds: [asin],
    itemIdType: "ASIN",
    condition: "New",
    resources: [
      "Images.Primary.Medium",
      "Images.Primary.Large",
      "ItemInfo.Features",
      "ItemInfo.Title"
    ],
    partnerTag: partnerTag,
    partnerType: "Associates",
    marketplace: "www.amazon.co.jp"
  }

  const response = await fetch(CREATORS_API_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: createAuthorizationHeader(token, API_VERSION),
      "Content-Type": "application/json; charset=utf-8",
      "X-Marketplace": "www.amazon.co.jp"
    },
    body: JSON.stringify(body)
  })

  console.log(`Creators API Response status: ${response.status}`)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Creators API error:", errorText)
    throw new Error(
      `Creators API request failed: ${response.status} ${errorText}`
    )
  }

  const responseBody: AmazonItemsResponse = await response.json()
  console.dir(responseBody.ItemsResult.Items, { depth: null, colors: true })

  return responseBody
}
