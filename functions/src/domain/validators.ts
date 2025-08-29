/**
 * API用の純粋なバリデーション関数群
 * 副作用がなく、テストしやすい関数を提供
 */

/**
 * Amazon仕様に従ってASIN形式を検証
 * @param asin - 検証するASIN文字列
 * @returns ASINが有効な場合（英数字10文字）はtrue、そうでなければfalse
 */
export const isValidAsin = (asin: string): boolean => {
  if (typeof asin !== 'string') {
    return false
  }
  return /^[A-Z0-9]{10}$/.test(asin)
}

/**
 * URLパスからASINを抽出
 * @param url - 完全なURL文字列
 * @returns 抽出されたASIN、見つからない場合はnull
 */
export const extractAsinFromUrl = (url: string): string | null => {
  const urlObj = new URL(url)
  const pathSegments = urlObj.pathname.split('/')
  
  // 期待する形式: /api/getAmznPa/{asin}
  const asinIndex = pathSegments.indexOf('getAmznPa') + 1
  const asin = pathSegments[asinIndex]
  return asin && asin.length > 0 ? asin : null
}

/**
 * Amazon API用の必要な環境変数を検証
 * @param config - API認証情報を含む設定オブジェクト
 * @returns 全ての必要な変数が存在し有効な場合はtrue
 */
export const validateAmazonConfig = (config: {
  accessKey?: string
  secretKey?: string
  partnerTag?: string
}): boolean => {
  return !!(
    config.accessKey &&
    config.secretKey &&
    config.partnerTag &&
    typeof config.accessKey === 'string' &&
    typeof config.secretKey === 'string' &&
    typeof config.partnerTag === 'string'
  )
}

// === OGP API用バリデーション関数 ===

/**
 * URLが有効な形式かどうかを検証
 * @param url - 検証するURL文字列
 * @returns URLが有効な形式の場合はtrue
 */
export const isValidUrl = (url: string): boolean => {
  if (typeof url !== 'string' || url.trim() === '') {
    return false
  }
  
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * リクエストからURLパラメータを抽出
 * @param request - HTTPリクエストオブジェクト
 * @returns 抽出されたURL、存在しない場合はnull
 */
export const extractUrlFromRequest = (request: Request): string | null => {
  const searchParams = new URL(request.url).searchParams
  const url = searchParams.get("url")
  return url && url.trim() !== '' ? url : null
}

/**
 * OGP API用の必要な環境変数を検証
 * @param config - 設定オブジェクト
 * @returns 全ての必要な変数が存在し有効な場合はtrue
 */
export const validateOgpConfig = (config: {
  slackWebhookUrl?: string
}): boolean => {
  return !!(
    config.slackWebhookUrl &&
    typeof config.slackWebhookUrl === 'string' &&
    config.slackWebhookUrl.startsWith('https://')
  )
}

// === セキュリティミドルウェア用バリデーション関数 ===

/**
 * sec-fetch-siteヘッダーが許可される値かどうかを検証
 * @param secFetchSite - sec-fetch-siteヘッダーの値
 * @returns 許可される値の場合はtrue
 */
export const isValidSecFetchSite = (secFetchSite: string | null): boolean => {
  if (!secFetchSite) {
    return false
  }
  const allowedSites = ["same-origin", "same-site"]
  return allowedSites.includes(secFetchSite)
}

/**
 * sec-fetch-modeヘッダーによる検証（MDN仕様準拠）
 * 明示的に拒否すべき値のみをブロックし、それ以外は無視する
 * @param secFetchMode - sec-fetch-modeヘッダーの値
 * @returns ブロックすべき場合はfalse、それ以外（無視すべき場合含む）はtrue
 */
export const isValidSecFetchMode = (secFetchMode: string | null): boolean => {
  // ヘッダーが存在しない場合は許可（ブラウザが古い等）
  if (!secFetchMode) {
    return true
  }
  
  // navigateモードのみ明示的にブロック（直接ブラウザアクセス）
  if (secFetchMode === "navigate") {
    return false
  }
  
  // その他の値（既知・未知問わず）は全て許可（MDN仕様に従い無視）
  return true
}

/**
 * セキュリティヘッダーに基づいたリクエストの検証
 * sec-fetch-siteとsec-fetch-modeを組み合わせた包括的な検証
 * @param request - HTTPリクエストオブジェクト
 * @returns リクエストが許可される場合はtrue
 */
export const isSecurityHeadersValid = (request: Request): boolean => {
  const headers = request.headers
  const secFetchSite = headers.get("sec-fetch-site")
  const secFetchMode = headers.get("sec-fetch-mode")
  
  // Sec-Fetch-Siteによる検証（主要な検証）
  if (secFetchSite && !isValidSecFetchSite(secFetchSite)) {
    return false
  }
  
  // Sec-Fetch-Modeによる追加検証
  if (secFetchMode && !isValidSecFetchMode(secFetchMode)) {
    return false
  }
  
  return true
}

// === OG画像生成用バリデーション関数 ===

/**
 * リクエストがtwitter-og.png画像生成リクエストかどうかを判定
 * @param request - HTTPリクエストオブジェクト
 * @returns twitter-og.pngリクエストの場合はtrue
 */
export const isTwitterOgImageRequest = (request: Request): boolean => {
  return request.url.endsWith('/twitter-og.png')
}

