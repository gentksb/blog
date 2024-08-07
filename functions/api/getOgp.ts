import { getOgpMetaData } from "../src/getOgpMetaData"
import { postLogToSlack } from "../src/postLogToSlack"

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const searchParams = new URL(context.request.url).searchParams
  const url = searchParams.get("url")

  const cache = await context.env.OGP_DATASTORE.get(url)

  if (cache) {
    console.log(`hitted OGP KV cache`)
    return new Response(cache, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "X-Robots-Tag": "noindex",
        "cache-control": "public, max-age=86400"
      }
    })
  }

  const body = await getOgpMetaData(url).catch(async (e) => {
    await postLogToSlack(
      `${context.request.url} \n error:${e}`,
      context.env.SLACK_WEBHOOK_URL
    )
    throw new Error(e)
  })

  const bodyString = JSON.stringify(body)
  await context.env.OGP_DATASTORE.put(url, bodyString, {
    expirationTtl: 60 * 60 * 24 * 7 // 1 week
  }).then(() => console.log(`write OGP Cache. url: ${url}`))

  return new Response(bodyString, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "X-Robots-Tag": "noindex",
      "cache-control": "public, max-age=86400"
    }
  })
}
