/**
 * 商品価格構造化データ用の純粋関数群
 * JSON-LD (schema.org Product) と OGP 価格メタタグから価格情報を抽出する
 */

import type { ProductPrice } from "@type/ogpData-type"

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * schema.org の @type が指定タイプを含むかどうかを判定
 * @type は文字列または文字列配列の両形式がある
 */
const hasSchemaType = (
  node: Record<string, unknown>,
  type: string
): boolean => {
  const nodeType = node["@type"]
  if (typeof nodeType === "string") {
    return nodeType === type
  }
  if (Array.isArray(nodeType)) {
    return nodeType.includes(type)
  }
  return false
}

/**
 * 価格表記を数値に正規化
 * サイトによって数値・"1,980"・"¥1,980" など表記ゆれがあるため吸収する
 * @param value - JSON-LD やメタタグから取得した価格値
 * @returns 0以上の有限数値、解釈できない場合は undefined
 */
export const parsePriceAmount = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : undefined
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[,\s¥￥$€£]/g, "")
    if (normalized === "") {
      return undefined
    }
    const amount = Number(normalized)
    return Number.isFinite(amount) && amount >= 0 ? amount : undefined
  }
  return undefined
}

/**
 * 通貨コードを ISO 4217 形式（英字3文字・大文字）に正規化
 * @param value - JSON-LD やメタタグから取得した通貨値
 * @returns 正規化済み通貨コード、形式外の場合は undefined
 */
export const normalizeCurrency = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  const code = value.trim().toUpperCase()
  return /^[A-Z]{3}$/.test(code) ? code : undefined
}

/**
 * 価格と通貨の生値から ProductPrice を組み立てる
 * どちらかが欠けている・解釈できない場合は undefined
 */
export const buildProductPrice = (
  amountRaw: unknown,
  currencyRaw: unknown
): ProductPrice | undefined => {
  const amount = parsePriceAmount(amountRaw)
  const currency = normalizeCurrency(currencyRaw)
  return amount !== undefined && currency ? { amount, currency } : undefined
}

/**
 * Offer / AggregateOffer 1件から価格を抽出
 * AggregateOffer は lowPrice を優先し、priceSpecification へのフォールバックも行う
 */
const priceFromOffer = (offer: unknown): ProductPrice | undefined => {
  if (!isRecord(offer)) {
    return undefined
  }

  const direct = buildProductPrice(
    offer.lowPrice ?? offer.price,
    offer.priceCurrency
  )
  if (direct) {
    return direct
  }

  // UnitPriceSpecification 等で価格を持つサイト向けフォールバック
  const specs = Array.isArray(offer.priceSpecification)
    ? offer.priceSpecification
    : [offer.priceSpecification]
  for (const spec of specs) {
    if (isRecord(spec)) {
      const specPrice = buildProductPrice(spec.price, spec.priceCurrency)
      if (specPrice) {
        return specPrice
      }
    }
  }
  return undefined
}

/**
 * offers プロパティ（単一 / 配列 / AggregateOffer 内のネスト）から価格を抽出
 */
const priceFromOffers = (offers: unknown): ProductPrice | undefined => {
  const offerList = Array.isArray(offers) ? offers : [offers]
  for (const offer of offerList) {
    const price = priceFromOffer(offer)
    if (price) {
      return price
    }
    // AggregateOffer が個別 Offer をネストして持つケース
    if (isRecord(offer) && offer.offers) {
      const nested = priceFromOffers(offer.offers)
      if (nested) {
        return nested
      }
    }
  }
  return undefined
}

/**
 * JSON-LD のノードツリーを走査し、最初に見つかった Product の価格を返す
 * ルートが単一オブジェクト・配列・@graph のいずれでも対応する
 */
const findProductPrice = (node: unknown): ProductPrice | undefined => {
  if (Array.isArray(node)) {
    for (const item of node) {
      const price = findProductPrice(item)
      if (price) {
        return price
      }
    }
    return undefined
  }
  if (!isRecord(node)) {
    return undefined
  }

  if (hasSchemaType(node, "Product") && node.offers) {
    const price = priceFromOffers(node.offers)
    if (price) {
      return price
    }
  }

  // @graph や mainEntity 等の入れ子構造を探索
  for (const value of Object.values(node)) {
    if (typeof value === "object" && value !== null) {
      const price = findProductPrice(value)
      if (price) {
        return price
      }
    }
  }
  return undefined
}

/**
 * JSON-LD テキストから schema.org Product の価格を抽出
 * @param jsonText - script[type="application/ld+json"] の中身
 * @returns 価格情報、Product が無い・解釈できない場合は undefined
 */
export const extractPriceFromJsonLd = (
  jsonText: string
): ProductPrice | undefined => {
  // JSON.parse 由来のデータに循環参照は存在しないため走査に深度制限は不要だが、
  // 病的に深いネストによるスタックオーバーフローはここで吸収する
  try {
    return findProductPrice(JSON.parse(jsonText))
  } catch {
    return undefined
  }
}

// Intl.NumberFormat はコンストラクタが高コストなため、isolate 生存中は通貨別に使い回す
const formatterCache = new Map<string, Intl.NumberFormat>()

/**
 * 価格を日本語ロケールの通貨表記に整形（例: ￥12,800 / $49.99）
 * currency は normalizeCurrency 済みの ISO 4217 形式であること
 */
export const formatProductPrice = (price: ProductPrice): string => {
  let formatter = formatterCache.get(price.currency)
  if (!formatter) {
    formatter = new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: price.currency
    })
    formatterCache.set(price.currency, formatter)
  }
  return formatter.format(price.amount)
}
