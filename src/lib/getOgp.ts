import { fetchOgp } from "./fetcher/fetchOgp"
import type { OgpData } from "@type/ogpData-type"

// interface ENV {
//   OGP_DATASTORE: KVNamespace
// }

export const getOgp = async (queryUrl: string): Promise<OgpData> => {
  // Cloudflare KVに保存されているOGP情報を取得して、ビルドキャッシュとして使いたかったがビルド環境からKVにアクセスできないため断念
  // ひとまず何もしないラッパー関数を作成して、あとからKVにアクセスできるようにする

  const res = await fetchOgp(queryUrl)
  return res
}
