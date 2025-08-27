/**
 * セキュリティミドルウェア
 * APIルートのsec-fetch-modeヘッダーを検証して不正アクセスを防止
 * 依存性注入を使ったクリーンアーキテクチャにリファクタリング済み
 */

import { 
  isValidSecFetchMode 
} from "./domain/validators"
import { 
  createForbiddenResponse 
} from "./domain/transformers"

/**
 * セキュリティミドルウェアの依存性注入を使った実装
 * @param request - HTTPリクエストオブジェクト
 * @returns リクエストを許可する場合はnull、拒否する場合はResponseオブジェクト
 */
export const createSecurityMiddleware = () => {
  return (request: Request): Response | null => {
    const { headers } = request
    const secFetchMode = headers.get("sec-fetch-mode")
    
    if (!isValidSecFetchMode(secFetchMode)) {
      return createForbiddenResponse()
    }
    
    // リクエストが続行すべきことを示すためnullを返す
    return null
  }
}

/**
 * セキュリティミドルウェアのメインエントリーポイント
 * APIルートのリクエストを検証
 */
export async function handleMiddleware(
  request: Request, 
  _env: Env, 
  _ctx: ExecutionContext
): Promise<Response | null> {
  const middleware = createSecurityMiddleware()
  return middleware(request)
}

// テスト用に純粋関数をエクスポート
export { 
  isValidSecFetchMode 
} from "./domain/validators"

export { 
  createForbiddenResponse 
} from "./domain/transformers"