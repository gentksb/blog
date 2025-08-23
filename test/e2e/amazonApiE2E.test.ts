/**
 * Amazon API用の真のE2Eテスト
 * Wranglerを使った実際のWorker環境での完全な統合テスト
 * モックは使わず、実際のWorker環境をテスト
 */

import { expect, test } from "vitest"
import { unstable_dev, type UnstableDevWorker } from "wrangler"

// 長時間のWorker起動を許可
const E2E_TIMEOUT = 30000

test("Amazon API E2E - 無効なASINで400エラーを返す", async () => {
  let worker: UnstableDevWorker | undefined
  
  try {
    // 実際のWorkerを起動
    worker = await unstable_dev("functions/_worker.ts", {
      env: "test",
      local: true,
      config: "wrangler.jsonc"
    })
    
    // 無効なASINでリクエスト
    const response = await worker.fetch("/api/getAmznPa/INVALID")
    
    expect(response.status).toBe(400)
    expect(await response.text()).toContain("Invalid ASIN format")
  } finally {
    if (worker) {
      await worker.stop()
    }
  }
}, E2E_TIMEOUT)

test("Amazon API E2E - 存在しないパスで404を返す", async () => {
  let worker: UnstableDevWorker | undefined
  
  try {
    worker = await unstable_dev("functions/_worker.ts", {
      env: "test", 
      local: true,
      config: "wrangler.jsonc"
    })
    
    const response = await worker.fetch("/api/nonexistent")
    
    expect(response.status).toBe(404)
  } finally {
    if (worker) {
      await worker.stop()
    }
  }
}, E2E_TIMEOUT)

test("Amazon API E2E - POSTメソッドで405エラーを返す", async () => {
  let worker: UnstableDevWorker | undefined
  
  try {
    worker = await unstable_dev("functions/_worker.ts", {
      env: "test",
      local: true, 
      config: "wrangler.jsonc"
    })
    
    const response = await worker.fetch("/api/getAmznPa/B004N3APGO", {
      method: "POST"
    })
    
    expect(response.status).toBe(405)
    expect(await response.text()).toContain("Method Not Allowed")
  } finally {
    if (worker) {
      await worker.stop()
    }
  }
}, E2E_TIMEOUT)

// 注意: 実際のPA-API呼び出しは環境変数が必要で、レート制限もあるため
// 本番では別途CI/CD環境で実行することを想定