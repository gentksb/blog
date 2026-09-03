/**
 * OGP アダプター層
 * 依存性注入を通じて外部依存を処理
 */

import type { OgpData } from "@type/ogpData-type"
import { getOgpMetaData } from "../services/getOgpMetaData"

/**
 * OGP API用の設定インターフェース
 */
export interface OgpConfig {
  slackWebhookUrl: string
}

/**
 * OGPデータを保存するためのキャッシュインターフェース
 */
export interface OgpCacheAdapter {
  get: (key: string) => Promise<OgpData | string | null>
  put: (key: string, data: OgpData | string, ttl?: number) => Promise<void>
}

/**
 * エラー報告用のロガーインターフェース
 */
export interface OgpLoggerAdapter {
  logError: (message: string, url: string) => Promise<void>
}

/**
 * OGPメタデータを取得するためのフェッチャーインターフェース
 */
export interface OgpFetcherAdapter {
  fetchOgpData: (url: string, env: Env) => Promise<OgpData>
}

/**
 * 全ての外部依存をカプセル化するOGPサービスアダプター
 */
export interface OgpAdapter {
  getOgpData: (url: string, env: Env) => Promise<OgpData>
  getCached: (url: string) => Promise<OgpData | string | null>
  cacheResult: (url: string, data: OgpData) => Promise<void>
  cacheFailure: (url: string, data: OgpData) => Promise<void>
  logError: (message: string, url: string) => Promise<void>
}

/** 取得失敗のネガティブキャッシュTTL。復旧を長く待たない範囲で再取得の連打を抑える */
const FAILURE_CACHE_TTL_SECONDS = 60 * 10

/**
 * 注入された依存関係を持つOGPアダプターを作成
 * @param deps - キャッシュ、設定、ロガー、フェッチャーを含む依存関係
 * @returns OGPアダプターインスタンス
 */
export const createOgpAdapter = (deps: {
  cache: OgpCacheAdapter
  config: OgpConfig
  logger: OgpLoggerAdapter
  fetcher: OgpFetcherAdapter
}): OgpAdapter => {
  return {
    async getOgpData(url: string, env: Env): Promise<OgpData> {
      return await deps.fetcher.fetchOgpData(url, env)
    },

    async getCached(url: string): Promise<OgpData | string | null> {
      return await deps.cache.get(url)
    },

    async cacheResult(url: string, data: OgpData): Promise<void> {
      await deps.cache.put(url, data, 60 * 60 * 24 * 7) // 1週間TTL
    },

    async cacheFailure(url: string, data: OgpData): Promise<void> {
      await deps.cache.put(url, data, FAILURE_CACHE_TTL_SECONDS)
    },

    async logError(message: string, url: string): Promise<void> {
      await deps.logger.logError(message, url)
    }
  }
}

/**
 * Cloudflare KVキャッシュアダプターを作成（OGP用）
 * @param kv - Cloudflare KVネームスペース
 * @returns キャッシュアダプター実装
 */
export const createOgpKVCacheAdapter = (kv: KVNamespace): OgpCacheAdapter => {
  return {
    async get(key: string): Promise<OgpData | string | null> {
      // まずJSON形式で取得を試す
      const jsonData = (await kv.get(key, "json")) as OgpData | null
      if (jsonData) {
        return jsonData
      }

      // 次にテキスト形式で取得を試す（既存データとの互換性のため）
      return await kv.get(key)
    },

    async put(
      key: string,
      data: OgpData | string,
      ttl = 60 * 60 * 24 * 7
    ): Promise<void> {
      const dataString = typeof data === "string" ? data : JSON.stringify(data)
      await kv.put(key, dataString, {
        expirationTtl: ttl
      })
    }
  }
}

/**
 * Slackロガーアダプターを作成（OGP用）
 * @param webhookUrl - Slack Webhook URL。空文字の場合は通知しない
 * @returns ロガーアダプター実装
 */
export const createOgpSlackLoggerAdapter = (
  webhookUrl: string
): OgpLoggerAdapter => {
  return {
    async logError(message: string, url: string): Promise<void> {
      if (!webhookUrl) return

      // 循環依存を回避するために動的インポート
      const { postLogToSlack } = await import("../services/postLogToSlack")
      await postLogToSlack(`OGP API Error: ${url}\n${message}`, webhookUrl)
    }
  }
}

/**
 * OGPメタデータフェッチャーアダプターを作成
 * @returns フェッチャーアダプター実装
 */
export const createOgpFetcherAdapter = (): OgpFetcherAdapter => {
  return {
    async fetchOgpData(url: string, env: Env): Promise<OgpData> {
      return await getOgpMetaData(url, env)
    }
  }
}
