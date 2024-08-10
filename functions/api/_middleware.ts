// validate sec-fetch header

export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const { headers } = request
  const secFetchMode = headers.get("sec-fetch-mode")
  if (
    secFetchMode !== "same-origin" &&
    secFetchMode !== "cors" &&
    secFetchMode !== "same-site"
  ) {
    return new Response("Forbidden", { status: 403 })
  }
  return context.next()
}
