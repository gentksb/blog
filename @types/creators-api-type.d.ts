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
