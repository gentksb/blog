/**
 * Amazon アダプター層
 * 依存性注入を通じて外部依存を処理
 */

import type { CreatorsApiItemsResponse } from "../services/getAmazonProductInfo"
import {
  describeItemsResponseError,
  getAmazonProductInfo
} from "../services/getAmazonProductInfo"

/**
 * Amazon API用の設定インターフェース
 */
export interface AmazonConfig {
  credentialId: string
  credentialSecret: string
  credentialVersion: string
  partnerTag: string
  marketplace: string
}

/**
 * Amazon商品データを保存するためのキャッシュインターフェース
 */
export interface CacheAdapter {
  get: (key: string) => Promise<CreatorsApiItemsResponse | null>
  put: (
    key: string,
    data: CreatorsApiItemsResponse,
    ttl?: number
  ) => Promise<void>
}

/**
 * エラー報告用のロガーインターフェース
 */
export interface LoggerAdapter {
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 商品取得の結果。API がエラーや空 items を HTTP 200 で返すため、
 * 呼び出し側がキャッシュ可否と通知要否を判断できるよう成否を分離する
 */
export type AmazonProductResult =
  | { ok: true; data: CreatorsApiItemsResponse }
  | { ok: false; data: CreatorsApiItemsResponse; error: string }

/**
 * 全ての外部依存をカプセル化するAmazonサービスアダプター
 */
export interface AmazonAdapter {
  getProductInfo: (asin: string) => Promise<AmazonProductResult>
  getCached: (asin: string) => Promise<CreatorsApiItemsResponse | null>
  cacheResult: (asin: string, data: CreatorsApiItemsResponse) => Promise<void>
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 注入された依存関係を持つAmazonアダプターを作成
 * @param deps - キャッシュ、設定、ロガー、KVを含む依存関係
 * @returns Amazonアダプターインスタンス
 * @public
 */
export const createAmazonAdapter = (deps: {
  cache: CacheAdapter
  config: AmazonConfig
  logger: LoggerAdapter
  kv: KVNamespace
}): AmazonAdapter => {
  return {
    async getProductInfo(asin: string): Promise<AmazonProductResult> {
      const data = await getAmazonProductInfo(asin, {
        credentialId: deps.config.credentialId,
        credentialSecret: deps.config.credentialSecret,
        credentialVersion: deps.config.credentialVersion,
        partnerTag: deps.config.partnerTag,
        marketplace: deps.config.marketplace,
        kv: deps.kv
      })

      const error = describeItemsResponseError(data)
      return error ? { ok: false, data, error } : { ok: true, data }
    },

    async getCached(asin: string): Promise<CreatorsApiItemsResponse | null> {
      return await deps.cache.get(asin)
    },

    async cacheResult(
      asin: string,
      data: CreatorsApiItemsResponse
    ): Promise<void> {
      await deps.cache.put(asin, data, 60 * 60 * 24) // 24時間TTL
    },

    async logError(message: string, url: string): Promise<void> {
      await deps.logger.logError(message, url)
    }
  }
}

/**
 * Cloudflare KVキャッシュアダプターを作成
 * @param kv - Cloudflare KVネームスペース
 * @returns キャッシュアダプター実装
 */
export const createKVCacheAdapter = (kv: KVNamespace): CacheAdapter => {
  return {
    async get(key: string): Promise<CreatorsApiItemsResponse | null> {
      return await kv.get(key, "json")
    },

    async put(
      key: string,
      data: CreatorsApiItemsResponse,
      ttl = 86400
    ): Promise<void> {
      await kv.put(key, JSON.stringify(data), {
        expirationTtl: ttl
      })
    }
  }
}

/**
 * Slackロガーアダプターを作成
 * @param webhookUrl - Slack Webhook URL。空文字の場合は通知しない
 * @returns ロガーアダプター実装
 */
export const createSlackLoggerAdapter = (webhookUrl: string): LoggerAdapter => {
  return {
    async logError(message: string, url: string): Promise<void> {
      if (!webhookUrl) return

      // 循環依存を回避するために動的インポート
      const { postLogToSlack } = await import("../services/postLogToSlack")
      await postLogToSlack(`Amazon API Error: ${url}\n${message}`, webhookUrl)
    }
  }
}
