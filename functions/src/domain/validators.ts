/**
 * Amazon API用の純粋なバリデーション関数群
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