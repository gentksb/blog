import type { APIRoute } from "astro"
import { fetchOgp } from "./src/fetchOgp"

export const GET: APIRoute = async ({ params, request }) => {
  console.table({ params, request })
  const queryUrl = new URL(request.url).searchParams.get("url")
  if (queryUrl === null) {
    return new Response("bad request", {
      status: 400
    })
  } else {
    try {
      const response = await fetchOgp(queryUrl)
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
