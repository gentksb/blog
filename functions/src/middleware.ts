/**
 * Security middleware for API routes
 * Validates sec-fetch-mode header to prevent unauthorized access
 */
export async function handleMiddleware(
  request: Request, 
  _env: Env, 
  _ctx: ExecutionContext
): Promise<Response | null> {
  const { headers } = request
  const secFetchMode = headers.get("sec-fetch-mode")
  
  if (
    secFetchMode !== "same-origin" &&
    secFetchMode !== "cors" &&
    secFetchMode !== "same-site"
  ) {
    return new Response("Forbidden", { status: 403 })
  }
  
  // Return null to indicate request should proceed
  return null
}