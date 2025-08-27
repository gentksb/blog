/**
 * OG画像生成 ハンドラー
 * ブログ記事用のOG画像動的生成を処理
 * 依存性注入を使ったクリーンアーキテクチャにリファクタリング済み
 */

import { 
  isTwitterOgImageRequest,
  extractPostPathFromImageRequest,
  validateOgpConfig 
} from "./domain/validators"
import { 
  createOgImageErrorResponse,
  createMethodNotAllowedResponse
} from "./domain/transformers"
import { 
  createOgImageAdapter,
  createOgImageSlackLoggerAdapter,
  createAssetFetcherAdapter,
  createHtmlParserAdapter,
  createImageGeneratorAdapter,
  type OgImageAdapter
} from "./adapters/ogImageAdapter"

/**
 * 依存性注入を使ったOG画像生成ハンドラーを作成
 * @param adapter - 注入された依存関係を持つOG画像生成アダプター
 * @returns OG画像生成リクエスト用のハンドラー関数
 */
export const createOgImageHandler = (adapter: OgImageAdapter) => {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'GET') {
      return createMethodNotAllowedResponse()
    }
    
    // twitter-og.pngリクエストかどうか検証
    if (!isTwitterOgImageRequest(request)) {
      throw new Error("Not a Twitter OG image request")
    }
    
    try {
      // 対応するHTMLページからメタデータを抽出
      const postMetadata = await adapter.extractPostMetadata(request)
      
      // リクエストから現在のホストを取得
      const currentHost = new URL(request.url).origin
      const fallbackImageUrl = `${currentHost}/image/logo.jpg`
      
      // 画像URLをそのまま使用（シンプルなアプローチ）
      const processedImageUrl = postMetadata.imageUrl || fallbackImageUrl
      
      console.log(`OG Image: Using image URL: ${processedImageUrl}`)
      
      // タイトルから不要な部分を削除
      const cleanTitle = postMetadata.title.replace(" | 幻想サイクル", "")
      
      // OG画像を生成
      const imageResponse = await adapter.generateOgImage(
        cleanTitle,
        processedImageUrl,
        currentHost
      )
      
      return imageResponse
      
    } catch (error) {
      console.error("Error generating OG image:", error)
      
      // Slackにエラーをログ
      await adapter.logError(
        `Error: ${(error as Error).message}`,
        request.url
      )
      
      return createOgImageErrorResponse()
    }
  }
}

/**
 * OG画像生成のGETリクエストを処理
 * 依存関係を作成してハンドラーに委譲するメインエントリーポイント
 */
export async function handleOgImage(
  request: Request, 
  env: Env, 
  _ctx: ExecutionContext
): Promise<Response> {
  // 設定を検証
  const config = {
    slackWebhookUrl: env.SLACK_WEBHOOK_URL
  }
  
  if (!validateOgpConfig(config)) {
    throw new Error("Environment variables are not valid")
  }
  
  // 依存性注入でアダプターを作成
  const logger = createOgImageSlackLoggerAdapter(env.SLACK_WEBHOOK_URL)
  const assetFetcher = createAssetFetcherAdapter(env.ASSETS)
  const htmlParser = createHtmlParserAdapter()
  const imageGenerator = createImageGeneratorAdapter()
  const adapter = createOgImageAdapter({ 
    config, 
    logger, 
    assetFetcher, 
    htmlParser, 
    imageGenerator 
  })
  
  // ハンドラーを作成して実行
  const handler = createOgImageHandler(adapter)
  return await handler(request)
}

// テスト用に純粋関数をエクスポート
export { 
  isTwitterOgImageRequest,
  extractPostPathFromImageRequest 
} from "./domain/validators"

export { 
  createOgImageErrorResponse
} from "./domain/transformers"

