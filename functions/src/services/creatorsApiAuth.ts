/**
 * Amazon Creators API OAuth 2.0 認証サービス
 * Amazon Cognitoを使用したクライアント認証
 */

// 日本リージョン用トークンエンドポイント（アジア: us-west-2）
const TOKEN_ENDPOINT =
  "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token"

// トークン有効期限のマージン（秒）
const TOKEN_EXPIRY_MARGIN = 30

// メモリキャッシュ用の変数
let cachedToken: string | null = null
let tokenExpiry: number | null = null

export interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

/**
 * OAuth 2.0 client_credentials フローでアクセストークンを取得
 */
export const getOAuthToken = async (
  credentialId: string,
  credentialSecret: string,
  kv?: KVNamespace
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)

  // メモリキャッシュをチェック
  if (cachedToken && tokenExpiry && now < tokenExpiry - TOKEN_EXPIRY_MARGIN) {
    console.log("Using cached OAuth token from memory")
    return cachedToken
  }

  // KVキャッシュをチェック（KVが提供されている場合）
  if (kv) {
    const kvToken = await kv.get("creators_api_token")
    const kvExpiry = await kv.get("creators_api_token_expiry")
    if (kvToken && kvExpiry) {
      const expiryTime = Number.parseInt(kvExpiry, 10)
      if (now < expiryTime - TOKEN_EXPIRY_MARGIN) {
        console.log("Using cached OAuth token from KV")
        // メモリキャッシュも更新
        cachedToken = kvToken
        tokenExpiry = expiryTime
        return kvToken
      }
    }
  }

  // 新しいトークンを取得
  console.log("Fetching new OAuth token from Cognito")

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: credentialId,
    client_secret: credentialSecret,
    scope: "creatorsapi/default"
  })

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("OAuth token fetch failed:", errorText)
    throw new Error(`OAuth token fetch failed: ${response.status} ${errorText}`)
  }

  const data: OAuthTokenResponse = await response.json()

  // トークンをキャッシュ
  const expiresAt = now + data.expires_in
  cachedToken = data.access_token
  tokenExpiry = expiresAt

  // KVにもキャッシュ（KVが提供されている場合）
  if (kv) {
    await kv.put("creators_api_token", data.access_token, {
      expirationTtl: data.expires_in - TOKEN_EXPIRY_MARGIN
    })
    await kv.put("creators_api_token_expiry", expiresAt.toString(), {
      expirationTtl: data.expires_in - TOKEN_EXPIRY_MARGIN
    })
  }

  return data.access_token
}

/**
 * Bearer認証ヘッダーを生成
 */
export const createAuthorizationHeader = (
  token: string,
  version = "2.3"
): string => {
  return `Bearer ${token}, Version ${version}`
}

/**
 * テスト用：キャッシュをクリア
 */
export const clearTokenCache = (): void => {
  cachedToken = null
  tokenExpiry = null
}
