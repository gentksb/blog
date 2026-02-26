/** Amazon Creators API のレスポンス型 */

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
