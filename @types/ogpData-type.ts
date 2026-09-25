export interface ProductPrice {
  amount: number
  currency: string
}

export interface OgpData {
  ogpTitle?: string
  ogpImageUrl?: string
  ogpDescription?: string
  ogpSiteName?: string
  productPrice?: ProductPrice
  pageurl?: string
  ok: boolean
  error?: string
  /** 取得失敗時のオリジンの HTTP ステータス。fetch 自体が失敗した場合は無い */
  status?: number
}
