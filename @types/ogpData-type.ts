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
  /** 配信元がHTTPエラーを返した場合のステータス。タイムアウトや接続失敗では入らない */
  status?: number
}
