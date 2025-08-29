/**
 * テスト用のモックデータヘルパー
 * モックデータを一元化して重複を減らし保守性を向上
 */

import { vi } from "vitest"
import type { AmazonItemsResponse, AmazonItem } from "amazon-paapi"

/**
 * テスト用の最小限の有効なAmazon商品アイテムを作成
 */
export const createMockAmazonItem = (asin: string = "B004N3APGO"): AmazonItem => ({
  ASIN: asin,
  DetailPageURL: `https://amazon.com/dp/${asin}`,
  Images: {
    Primary: {
      Small: {
        URL: "https://example.com/small.jpg",
        Height: 75,
        Width: 75
      },
      Medium: {
        URL: "https://example.com/medium.jpg", 
        Height: 160,
        Width: 160
      },
      Large: {
        URL: "https://example.com/large.jpg",
        Height: 500,
        Width: 500
      }
    }
  },
  ItemInfo: {
    Title: {
      DisplayValue: "Test Product",
      Label: "Title",
      Locale: "en_US"
    },
    Features: {
      DisplayValues: ["Feature 1", "Feature 2"],
      Label: "Features", 
      Locale: "en_US"
    }
  },
  Offers: {
    Listings: [{
      Id: "test-offer",
      Availability: {},
      IsBuyboxWinner: true,
      Price: {
        Amount: 1000,
        Currency: "JPY",
        DisplayAmount: "¥1,000"
      },
      SavingBasis: {
        Amount: 1200,
        Currency: "JPY", 
        DisplayAmount: "¥1,200"
      }
    }]
  }
})

/**
 * テスト用の有効なAmazon Items Responseを作成
 */
export const createMockAmazonResponse = (asin: string = "B004N3APGO"): AmazonItemsResponse => ({
  ItemsResult: {
    Items: [createMockAmazonItem(asin)]
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
  PAAPI_ACCESSKEY: "test-key",
  PAAPI_SECRETKEY: "test-secret",
  PARTNER_TAG: "test-tag",
  NODE_VERSION: "22.14" as const,
  ASSETS: {} as Fetcher,
  ...overrides
})