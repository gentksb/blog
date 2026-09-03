/**
 * MDX 拡張記法のサーバコンポーネントが受け取る入力値の検証関数群
 * 副作用がなく、テストしやすい関数を提供
 */

/**
 * Amazon仕様に従ってASIN形式を検証
 * @param asin - 検証するASIN文字列
 * @returns ASINが有効な場合（英数字10文字）はtrue、そうでなければfalse
 */
export const isValidAsin = (asin: string): boolean => {
  if (typeof asin !== "string") {
    return false
  }
  return /^[A-Z0-9]{10}$/.test(asin)
}

/**
 * URLが有効な形式かどうかを検証
 * @param url - 検証するURL文字列
 * @returns URLが有効な形式の場合はtrue
 */
export const isValidUrl = (url: string): boolean => {
  if (typeof url !== "string" || url.trim() === "") {
    return false
  }

  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
  } catch {
    return false
  }
}
