import { fetchOgp } from "./fetcher/fetchOgp"
import type { OgpData } from "@type/ogpData-type"
import { getOgpCache, putOgpCache } from "~/cache"

// まとめて取得してメモリに乗せたほうが速いが、画像生成比べると誤差レベルなのでコードのシンプルさを優先して毎回問い合わせる

export const getOgp = async (queryUrl: string): Promise<OgpData> => {
  const cache = await getOgpCache(queryUrl)

  if (!cache) {
    const res = await fetchOgp(queryUrl)
    putOgpCache(queryUrl, res)
    return res
  } else {
    console.log("hit OGP cache from KV: ", queryUrl)
    return cache
  }
}
