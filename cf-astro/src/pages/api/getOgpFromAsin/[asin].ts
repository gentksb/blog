import type { APIRoute } from "astro"
import { getAmazonProductInfo } from "./src/getAmazonProductInfo"

export const GET: APIRoute = async ({ params, request }) => {
  console.dir({ params, request }, { depth: null, colors: true })
  if (params.asin === undefined) {
    return new Response("bad request", {
      status: 400
    })
  } else {
    try {
      const response = await getAmazonProductInfo(params.asin)
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "cache-control": "max-age=86400"
        }
      })
    } catch (error) {
      console.error(error)

      return new Response("internal error", {
        status: 500
      })
    }
  }
}
