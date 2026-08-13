/** Creators API のレスポンス型（実レスポンスから定義） */
export interface CreatorsApiItemsResponse {
  errors?: Array<{
    code: string
    message: string
  }>
  itemsResult: {
    items: CreatorsApiItem[]
  }
}

export interface CreatorsApiItem {
  asin: string
  detailPageURL: string
  images?: {
    primary?: {
      small?: CreatorsApiImage
      medium?: CreatorsApiImage
      large?: CreatorsApiImage
    }
    variants?: {
      small?: CreatorsApiImage
      medium?: CreatorsApiImage
      large?: CreatorsApiImage
    }
  }
  itemInfo?: {
    title?: {
      displayValue: string
      label: string
      locale: string
    }
    features?: {
      displayValues: string[]
      label: string
      locale: string
    }
    byLineInfo?: {
      brand?: { displayValue: string; label: string; locale: string }
      manufacturer?: { displayValue: string; label: string; locale: string }
      contributors?: Array<{
        name: string
        role: string
        roleType: string
        locale: string
      }>
    }
    classifications?: Record<string, unknown>
    contentInfo?: Record<string, unknown>
    productInfo?: Record<string, unknown>
    technicalInfo?: Record<string, unknown>
  }
  offersV2?: {
    listings?: Array<{
      isBuyBoxWinner?: boolean
      loyaltyPoints?: { points: number }
      price?: {
        money?: {
          amount: number
          currency: string
          displayAmount: string
        }
        savings?: {
          money?: { displayAmount: string }
          percentage?: number
        }
      }
    }>
  }
  parentASIN?: string
}

export interface CreatorsApiImage {
  height: number
  url: string
  width: number
}

export interface CreatorsApiConfig {
  credentialId: string
  credentialSecret: string
  credentialVersion: string
  partnerTag: string
  marketplace: string
  kv: KVNamespace
}

/** Credential Version がリージョンを兼ねるため、トークンエンドポイントはバージョンから引く */
const TOKEN_ENDPOINTS: Record<string, string> = {
  "3.1": "https://api.amazon.com/auth/o2/token",
  "3.2": "https://api.amazon.co.uk/auth/o2/token",
  "3.3": "https://api.amazon.co.jp/auth/o2/token"
}
const TOKEN_SCOPE = "creatorsapi::default"
const API_BASE_URL = "https://creatorsapi.amazon/catalog/v1"
const TOKEN_CACHE_TTL_SECONDS = 3300

interface TokenCache {
  accessToken: string
  expiresAt: number
}

const getTokenEndpoint = (credentialVersion: string): string => {
  const endpoint = TOKEN_ENDPOINTS[credentialVersion]
  if (!endpoint) {
    throw new Error(
      `Unsupported credential version: ${credentialVersion} (supported: ${Object.keys(TOKEN_ENDPOINTS).join(", ")})`
    )
  }
  return endpoint
}

/** 認証情報の世代が変わるとトークンも無効になるため、キャッシュキーをバージョンで分ける */
const getTokenCacheKey = (credentialVersion: string) =>
  `_creators_api_oauth_token_v${credentialVersion}`

const getCachedToken = async (
  kv: KVNamespace,
  cacheKey: string
): Promise<string | null> => {
  const cached = await kv.get<TokenCache>(cacheKey, "json")
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) return null
  return cached.accessToken
}

const fetchAccessToken = async (
  tokenEndpoint: string,
  credentialId: string,
  credentialSecret: string
): Promise<{ accessToken: string; expiresIn: number }> => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: credentialId,
      client_secret: credentialSecret,
      scope: TOKEN_SCOPE
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to fetch access token: ${response.status} ${errorText}`
    )
  }

  const data = await response.json<{
    access_token: string
    expires_in: number
  }>()
  return { accessToken: data.access_token, expiresIn: data.expires_in }
}

const getAccessToken = async (
  kv: KVNamespace,
  credentialId: string,
  credentialSecret: string,
  credentialVersion: string
): Promise<string> => {
  const cacheKey = getTokenCacheKey(credentialVersion)
  const cached = await getCachedToken(kv, cacheKey)
  if (cached) return cached

  const { accessToken, expiresIn } = await fetchAccessToken(
    getTokenEndpoint(credentialVersion),
    credentialId,
    credentialSecret
  )

  const expiresAt = Date.now() + expiresIn * 1000 - 300_000
  await kv.put(cacheKey, JSON.stringify({ accessToken, expiresAt }), {
    expirationTtl: TOKEN_CACHE_TTL_SECONDS
  })

  return accessToken
}

export const getAmazonProductInfo = async (
  asin: string,
  config: CreatorsApiConfig
): Promise<CreatorsApiItemsResponse> => {
  const token = await getAccessToken(
    config.kv,
    config.credentialId,
    config.credentialSecret,
    config.credentialVersion
  )

  const requestBody = {
    itemIds: [asin],
    itemIdType: "ASIN",
    resources: [
      "images.primary.medium",
      "images.primary.large",
      "itemInfo.byLineInfo",
      "itemInfo.features",
      "itemInfo.title",
      "offersV2.listings.price",
      "offersV2.listings.isBuyBoxWinner",
      "offersV2.listings.loyaltyPoints"
    ],
    condition: "New",
    marketplace: config.marketplace,
    partnerTag: config.partnerTag
  }

  const response = await fetch(`${API_BASE_URL}/getItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-marketplace": config.marketplace
    },
    body: JSON.stringify(requestBody)
  })

  console.log(`Creators API Response status: ${response.status}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Creators API error: ${response.status} ${errorText}`)
  }

  const responseBody = await response.json<CreatorsApiItemsResponse>()

  if (responseBody.errors?.length) {
    console.warn(
      `Creators API returned errors for ASIN ${asin}:`,
      JSON.stringify(responseBody.errors)
    )
  }
  console.dir(responseBody.itemsResult?.items, { depth: null, colors: true })

  return responseBody
}
