import { env } from "cloudflare:workers"
import { expect, test } from "vitest"
import { createOgpKVCacheAdapter } from "../../src/server/adapters/ogpAdapter"

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
