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
    byLineInfo?: Record<string, unknown>
    classifications?: Record<string, unknown>
    contentInfo?: Record<string, unknown>
    productInfo?: Record<string, unknown>
    technicalInfo?: Record<string, unknown>
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

const TOKEN_ENDPOINT =
  "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token"
const API_BASE_URL = "https://creatorsapi.amazon/catalog/v1"
const TOKEN_CACHE_KEY = "_creators_api_oauth_token"
const TOKEN_CACHE_TTL_SECONDS = 3300

interface TokenCache {
  accessToken: string
  expiresAt: number
}

const getCachedToken = async (kv: KVNamespace): Promise<string | null> => {
  const cached = await kv.get<TokenCache>(TOKEN_CACHE_KEY, "json")
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) return null
  return cached.accessToken
}

const fetchAccessToken = async (
  credentialId: string,
  credentialSecret: string
): Promise<{ accessToken: string; expiresIn: number }> => {
  const body = new URLSearchParams({
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
    body: body.toString()
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
  credentialSecret: string
): Promise<string> => {
  const cached = await getCachedToken(kv)
  if (cached) return cached

  const { accessToken, expiresIn } = await fetchAccessToken(
    credentialId,
    credentialSecret
  )

  const expiresAt = Date.now() + expiresIn * 1000 - 300_000
  await kv.put(TOKEN_CACHE_KEY, JSON.stringify({ accessToken, expiresAt }), {
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
    config.credentialSecret
  )

  const requestBody = {
    itemIds: [asin],
    itemIdType: "ASIN",
    resources: [
      "images.primary.medium",
      "images.primary.large",
      "itemInfo.features",
      "itemInfo.title"
    ],
    condition: "New",
    marketplace: config.marketplace,
    partnerTag: config.partnerTag
  }

  const response = await fetch(`${API_BASE_URL}/getItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}, Version ${config.credentialVersion}`,
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
