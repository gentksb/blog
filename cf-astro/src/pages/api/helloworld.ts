import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params, request }) => {
  console.table({ params, request })
  return new Response("hello world", {
    status: 200
  })
}
