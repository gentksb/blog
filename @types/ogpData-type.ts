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
}
