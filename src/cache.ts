import type { OgpData } from "@type/ogpData-type"

const baseUrl = "https://api.cloudflare.com/client/v4/"
const kv_namespace = import.meta.env.OGP_DATASTORE_ID
const account_identifier = import.meta.env.CLOUDFLARE_ACCOUNT_IDENTIFIER
const api_token = import.meta.env.CLOUDFLARE_KV_TOKEN

// URLをキーにキャッシュを取得・作成するが、日本語URLなどを考慮してBASE64エンコードしてキーにする

// 型チェッカー

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isOgpData = (data: any): data is OgpData => {
  return typeof data === "object" && typeof data.ok === "boolean"
}
const isValidJsonText = (text: string): boolean => {
  try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

export const getOgpCache = async (key: string): Promise<OgpData | null> => {
  // check environment variables
  if (!account_identifier || !api_token || !kv_namespace) {
    throw new Error("missing environment variables")
  }
  const base64encodedKey = btoa(encodeURIComponent(key))

  const url = `${baseUrl}accounts/${account_identifier}/storage/kv/namespaces/${kv_namespace}/values/${base64encodedKey}`
  const init = {
    headers: {
      Authorization: `Bearer ${api_token}`
    }
  }

  const response = await fetch(url, init)
  const result = await response.text()
  const ogpCacheRecord = isValidJsonText(result) ? JSON.parse(result) : null

  if (response.ok && isOgpData(ogpCacheRecord)) {
    return ogpCacheRecord
  } else {
    return null
  }
}

export const putOgpCache = async (key: string, value: OgpData) => {
  // check environment variables
  if (!account_identifier || !api_token || !kv_namespace) {
    throw new Error("missing environment variables")
  }

  // key is url UTF- string so it needs to be BASE64 encoded
  const base64encodedKey = btoa(encodeURIComponent(key))

  const url = `${baseUrl}accounts/${account_identifier}/storage/kv/namespaces/${kv_namespace}/values/${base64encodedKey}`
  const init = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${api_token}`
    },
    body: JSON.stringify(value)
  }

  const response = await fetch(url, init)

  if (response.ok) {
    return "success"
  } else {
    console.log(`failed to put cache: ${key}`)
    return null
  }
}
