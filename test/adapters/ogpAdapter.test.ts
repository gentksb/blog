import { env } from "cloudflare:workers"
import { expect, test } from "vitest"
import {
  createOgpAdapter,
  createOgpKVCacheAdapter
} from "../../src/server/adapters/ogpAdapter"

// KV には JSON 化前の生文字列で保存された旧データが残っている可能性がある。
// kv.get(key, "json") は非 JSON 値に対して SyntaxError を投げるため、
// アダプタがテキスト形式で読み直せることを確認する
test("JSONとして解釈できないレガシー値はテキストとして読み出す", async () => {
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const key = `legacy-plain-text-${Date.now()}`

  await env.OGP_DATASTORE.put(key, "plain legacy text")
  try {
    expect(await cache.get(key)).toBe("plain legacy text")
  } finally {
    await env.OGP_DATASTORE.delete(key)
  }
})

test.each([
  { status: 404, ttl: 60 * 60 * 24 * 7, reason: "リンク先が消えた" },
  { status: 410, ttl: 60 * 60 * 24 * 7, reason: "リンク先が消えた" },
  { status: 403, ttl: 60 * 60 * 24, reason: "配信元に拒否された" },
  { status: 429, ttl: 60 * 10, reason: "配信元の流量制限" },
  { status: 408, ttl: 60 * 10, reason: "配信元のタイムアウト" },
  { status: 530, ttl: 60 * 10, reason: "配信元の障害" },
  { status: undefined, ttl: 60 * 10, reason: "タイムアウトや接続失敗" }
])(
  "$reason（status: $status）の失敗は $ttl 秒キャッシュする",
  async ({ status, ttl }) => {
    const puts: Array<{ key: string; ttl?: number }> = []
    const adapter = createOgpAdapter({
      cache: {
        get: async () => null,
        put: async (key, _data, putTtl) => {
          puts.push({ key, ttl: putTtl })
        }
      },
      config: { slackWebhookUrl: "" },
      logger: { logError: async () => {} },
      fetcher: { fetchOgpData: async () => ({ ok: false }) }
    })

    await adapter.cacheFailure("https://example.com/", { ok: false, status })

    expect(puts).toEqual([{ key: "https://example.com/", ttl }])
  }
)
