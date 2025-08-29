/**
 * セキュリティミドルウェア
 * Sec-Fetch-SiteとSec-Fetch-Modeヘッダーに基づくアクセス制御
 * 不正アクセス（CSRF、SSRF等）を防止するための包括的なセキュリティ機能
 */

import { 
  isSecurityHeadersValid 
} from "../domain/validators"
import { 
  createForbiddenResponse 
} from "../domain/transformers"

/**
 * セキュリティミドルウェアの依存性注入を使った実装
 * Sec-Fetch-SiteとSec-Fetch-Modeヘッダーに基づく包括的なアクセス制御
 * @param request - HTTPリクエストオブジェクト
 * @returns リクエストを許可する場合はnull、拒否する場合はResponseオブジェクト
 */
export const createSecurityMiddleware = () => {
  return (request: Request): Response | null => {
    if (!isSecurityHeadersValid(request)) {
      return createForbiddenResponse()
    }
    
    // リクエストが続行すべきことを示すためnullを返す
    return null
  }
}

/**
 * セキュリティミドルウェアのメインエントリーポイント
 * Sec-Fetch-SiteとSec-Fetch-Modeヘッダーに基づく包括的なアクセス制御
 * 提供されたサンプルコードのロジックを基に実装
 */
export async function handleMiddleware(
  request: Request, 
  _env: Env, 
  _ctx: ExecutionContext
): Promise<Response | null> {
  const headers = request.headers
  const secFetchSite = headers.get("sec-fetch-site")
  const secFetchMode = headers.get("sec-fetch-mode")
  
  // Sec-Fetch-Siteによる検証（より推奨）
  if (secFetchSite) {
    const allowedSites = ["same-origin", "same-site"]
    if (!allowedSites.includes(secFetchSite)) {
      return new Response("Forbidden", { status: 403 })
    }
  }
  
  // 追加の検証層
  if (secFetchMode === "navigate") {
    // ブラウザの直接アクセスをブロック
    return new Response("Forbidden", { status: 403 })
  }
  
  return null
}

// テスト用に純粋関数をエクスポート
export { 
  isSecurityHeadersValid,
  isValidSecFetchSite,
  isValidSecFetchMode 
} from "../domain/validators"

export { 
  createForbiddenResponse 
} from "../domain/transformers"