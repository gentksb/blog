/**
 * Amazon アダプター層
 * 依存性注入を通じて外部依存を処理
 */

import type { AmazonItemsResponse } from "amazon-paapi"
import { getAmazonProductInfo } from "../services/getAmazonProductInfo"

/**
 * Amazon Creators API用の設定インターフェース
 */
export interface AmazonConfig {
  credentialId: string
  credentialSecret: string
  partnerTag: string
}

/**
 * Amazon商品データを保存するためのキャッシュインターフェース
 */
export interface CacheAdapter {
  get: (key: string) => Promise<AmazonItemsResponse | null>
  put: (key: string, data: AmazonItemsResponse, ttl?: number) => Promise<void>
}

/**
 * エラー報告用のロガーインターフェース
 */
export interface LoggerAdapter {
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 全ての外部依存をカプセル化するAmazonサービスアダプター
 */
export interface AmazonAdapter {
  getProductInfo: (asin: string) => Promise<AmazonItemsResponse>
  getCached: (asin: string) => Promise<AmazonItemsResponse | null>
  cacheResult: (asin: string, data: AmazonItemsResponse) => Promise<void>
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 注入された依存関係を持つAmazonアダプターを作成
 * @param deps - キャッシュ、設定、ロガー、KVを含む依存関係
 * @returns Amazonアダプターインスタンス
 */
export const createAmazonAdapter = (deps: {
  cache: CacheAdapter
  config: AmazonConfig
  logger: LoggerAdapter
  kv?: KVNamespace // OAuthトークンキャッシュ用
}): AmazonAdapter => {
  return {
    async getProductInfo(asin: string): Promise<AmazonItemsResponse> {
      return await getAmazonProductInfo(
        asin,
        deps.config.credentialId,
        deps.config.credentialSecret,
        deps.config.partnerTag,
        deps.kv
      )
    },

    async getCached(asin: string): Promise<AmazonItemsResponse | null> {
      return await deps.cache.get(asin)
    },

    async cacheResult(asin: string, data: AmazonItemsResponse): Promise<void> {
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
    async get(key: string): Promise<AmazonItemsResponse | null> {
      return await kv.get(key, "json")
    },

    async put(
      key: string,
      data: AmazonItemsResponse,
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
 * @param webhookUrl - Slack Webhook URL
 * @returns ロガーアダプター実装
 */
export const createSlackLoggerAdapter = (webhookUrl: string): LoggerAdapter => {
  return {
    async logError(message: string, url: string): Promise<void> {
      // 循環依存を回避するために動的インポート
      const { postLogToSlack } = await import("../services/postLogToSlack")
      await postLogToSlack(`Amazon API Error: ${url}\n${message}`, webhookUrl)
    }
  }
}
