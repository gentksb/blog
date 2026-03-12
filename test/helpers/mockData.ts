/**
 * テスト用のモックデータヘルパー
 * モックデータを一元化して重複を減らし保守性を向上
 */

import type {
  CreatorsApiItem,
  CreatorsApiItemsResponse
} from "../../src/server/services/getAmazonProductInfo"
import { vi } from "vitest"

/**
 * テスト用の最小限の有効なAmazon商品アイテムを作成
 */
export const createMockAmazonItem = (
  asin: string = "B004N3APGO"
): CreatorsApiItem => ({
  asin: asin,
  detailPageURL: `https://amazon.com/dp/${asin}`,
  images: {
    primary: {
      small: {
        url: "https://example.com/small.jpg",
        height: 75,
        width: 75
      },
      medium: {
        url: "https://example.com/medium.jpg",
        height: 160,
        width: 160
      },
      large: {
        url: "https://example.com/large.jpg",
        height: 500,
        width: 500
      }
    }
  },
  itemInfo: {
    title: {
      displayValue: "Test Product",
      label: "Title",
      locale: "en_US"
    },
    features: {
      displayValues: ["Feature 1", "Feature 2"],
      label: "Features",
      locale: "en_US"
    }
  }
})

/**
 * テスト用の有効なAmazon Items Responseを作成
 */
export const createMockAmazonResponse = (
  asin: string = "B004N3APGO"
): CreatorsApiItemsResponse => ({
  itemsResult: {
    items: [createMockAmazonItem(asin)]
  }
})

/**
 * テスト用のモックKVネームスペースを作成
 */
export const createMockKV = (): Partial<KVNamespace> => ({
  get: vi.fn().mockResolvedValue(null),
  put: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  list: vi.fn().mockResolvedValue({ keys: [], list_complete: true }),
  getWithMetadata: vi.fn().mockResolvedValue({ value: null, metadata: null })
})

/**
 * テスト用の適切に型付けされたモック環境を作成
 */
export const createMockEnv = (overrides: Partial<Env> = {}): Env => ({
  SLACK_WEBHOOK_URL: "https://hooks.slack.com/test",
  PAAPI_DATASTORE: createMockKV() as KVNamespace,
  OGP_DATASTORE: createMockKV() as KVNamespace,
  CREATORS_CREDENTIAL_ID: "test-credential-id",
  CREATORS_CREDENTIAL_SECRET: "test-credential-secret",
  PARTNER_TAG: "test-tag",
  ASSETS: {} as Fetcher,
  CLOUDFLARE_API_TOKEN: "test-cf-token",
  CLOUDFLARE_ACCOUNT_ID: "test-cf-account",
  GITHUB_TOKEN: "test-github-token",
  ...overrides
})
