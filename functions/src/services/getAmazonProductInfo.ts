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

  const rawResponse = await response.json()
  console.log(
    "Creators API raw response:",
    JSON.stringify(rawResponse, null, 2)
  )

  // Creators APIはcamelCaseでレスポンスを返すため、PAAPI v5形式に変換
  const responseBody: AmazonItemsResponse =
    normalizeCreatorsApiResponse(rawResponse)
  console.dir(responseBody.ItemsResult.Items, { depth: null, colors: true })

  return responseBody
}

/**
 * Creators APIのcamelCaseレスポンスをPAAPI v5形式（PascalCase）に変換
 */
// biome-ignore lint/suspicious/noExplicitAny: Creators APIのレスポンス形式は動的
function normalizeCreatorsApiResponse(raw: any): AmazonItemsResponse {
  console.log("Raw response keys:", Object.keys(raw))

  // Creators APIがPascalCaseで返す場合はそのまま返す
  if (raw.ItemsResult?.Items?.length > 0) {
    console.log("Using PascalCase format (ItemsResult)")
    return raw as AmazonItemsResponse
  }

  // camelCase → PascalCase変換
  if (raw.itemsResult?.items?.length > 0) {
    console.log("Using camelCase format (itemsResult)")
    return {
      ItemsResult: {
        Items: raw.itemsResult.items.map(normalizeItem)
      }
    } as AmazonItemsResponse
  }

  // GetItemsResponse形式（PA-API v5と同じ）
  if (raw.GetItemsResponse?.ItemsResult?.Items?.length > 0) {
    console.log("Using GetItemsResponse format")
    return raw.GetItemsResponse as AmazonItemsResponse
  }

  // getItemsResponse形式（camelCase）
  if (raw.getItemsResponse?.itemsResult?.items?.length > 0) {
    console.log("Using getItemsResponse format (camelCase)")
    return {
      ItemsResult: {
        Items: raw.getItemsResponse.itemsResult.items.map(normalizeItem)
      }
    } as AmazonItemsResponse
  }

  // エラーレスポンスをチェック
  if (raw.Errors || raw.errors) {
    const errors = raw.Errors || raw.errors
    console.error("API returned errors:", JSON.stringify(errors, null, 2))
  }

  // フォールバック: 空のレスポンス
  console.error(
    "Unexpected Creators API response format. Full response:",
    JSON.stringify(raw, null, 2)
  )
  return {
    ItemsResult: {
      Items: []
    }
  } as AmazonItemsResponse
}

/**
 * 個別アイテムのフィールドを正規化
 */
// biome-ignore lint/suspicious/noExplicitAny: 動的レスポンス形式の変換
function normalizeItem(item: any): any {
  if (!item) return item

  return {
    ASIN: item.asin || item.ASIN,
    DetailPageURL: item.detailPageURL || item.DetailPageURL,
    Images: normalizeImages(item.images || item.Images),
    ItemInfo: normalizeItemInfo(item.itemInfo || item.ItemInfo),
    Offers: item.offers || item.Offers
  }
}

// biome-ignore lint/suspicious/noExplicitAny: 動的レスポンス形式の変換
function normalizeImages(images: any): any {
  if (!images) return images
  return {
    Primary: {
      Medium: images.primary?.medium || images.Primary?.Medium,
      Large: images.primary?.large || images.Primary?.Large
    }
  }
}

// biome-ignore lint/suspicious/noExplicitAny: 動的レスポンス形式の変換
function normalizeItemInfo(itemInfo: any): any {
  if (!itemInfo) return itemInfo
  return {
    Title: itemInfo.title || itemInfo.Title,
    Features: itemInfo.features || itemInfo.Features
  }
}
