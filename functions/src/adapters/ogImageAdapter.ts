/**
 * OG画像生成 アダプター層
 * 依存性注入を通じて外部依存を処理
 */

/**
 * 投稿メタデータの型定義
 */
export interface PostMetadata {
  title: string
  imageUrl: string
}

/**
 * OG画像生成用の設定インターフェース
 */
export interface OgImageConfig {
  slackWebhookUrl: string
}

/**
 * エラー報告用のロガーインターフェース
 */
export interface OgImageLoggerAdapter {
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 静的アセットを取得するためのアセットアダプターインターフェース
 */
export interface AssetFetcherAdapter {
  fetchAsset: (request: Request) => Promise<Response>
}

/**
 * HTMLメタデータを抽出するためのパーサーアダプター
 */
export interface HtmlParserAdapter {
  parseMetadata: (response: Response) => Promise<PostMetadata>
}

/**
 * OG画像を生成するためのイメージジェネレーターアダプター
 */
export interface ImageGeneratorAdapter {
  generateImage: (
    title: string,
    imageUrl: string,
    currentHost: string
  ) => Promise<Response>
}

/**
 * 全ての外部依存をカプセル化するOG画像生成サービスアダプター
 */
export interface OgImageAdapter {
  extractPostMetadata: (request: Request) => Promise<PostMetadata>
  generateOgImage: (
    title: string,
    imageUrl: string,
    currentHost: string
  ) => Promise<Response>
  logError: (message: string, url: string) => Promise<void>
}

/**
 * 注入された依存関係を持つOG画像生成アダプターを作成
 * @param deps - 設定、ロガー、フェッチャー、パーサー、ジェネレーターを含む依存関係
 * @returns OG画像生成アダプターインスタンス
 */
export const createOgImageAdapter = (deps: {
  config: OgImageConfig
  logger: OgImageLoggerAdapter
  assetFetcher: AssetFetcherAdapter
  htmlParser: HtmlParserAdapter
  imageGenerator: ImageGeneratorAdapter
}): OgImageAdapter => {
  return {
    async extractPostMetadata(request: Request): Promise<PostMetadata> {
      const imagePathSuffix = "/twitter-og.png"
      const htmlUrl = request.url.replace(imagePathSuffix, "")

      console.log(`OG Image: Attempting to fetch HTML from: ${htmlUrl}`)

      // HTMLページのリクエストを作成
      const htmlRequest = new Request(htmlUrl, {
        method: "GET",
        headers: request.headers
      })

      // 静的アセットからHTMLページを取得
      let response = await deps.assetFetcher.fetchAsset(htmlRequest)

      console.log(`OG Image: HTML fetch response status: ${response.status}`)

      if (!response.ok) {
        // 代替パス（末尾スラッシュ付き）を試す
        const alternativeUrl = htmlUrl.endsWith("/") ? htmlUrl : `${htmlUrl}/`
        console.log(`OG Image: Trying alternative URL: ${alternativeUrl}`)

        const alternativeRequest = new Request(alternativeUrl, {
          method: "GET",
          headers: request.headers
        })

        response = await deps.assetFetcher.fetchAsset(alternativeRequest)
        console.log(
          `OG Image: Alternative fetch response status: ${response.status}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch HTML page: ${response.status}`)
        }
      }

      return await deps.htmlParser.parseMetadata(response)
    },

    async generateOgImage(
      title: string,
      imageUrl: string,
      currentHost: string
    ): Promise<Response> {
      return await deps.imageGenerator.generateImage(
        title,
        imageUrl,
        currentHost
      )
    },

    async logError(message: string, url: string): Promise<void> {
      await deps.logger.logError(message, url)
    }
  }
}

/**
 * Slackロガーアダプターを作成（OG画像生成用）
 * @param webhookUrl - Slack Webhook URL
 * @returns ロガーアダプター実装
 */
export const createOgImageSlackLoggerAdapter = (
  webhookUrl: string
): OgImageLoggerAdapter => {
  return {
    async logError(message: string, url: string): Promise<void> {
      // 循環依存を回避するために動的インポート
      const { postLogToSlack } = await import("../services/postLogToSlack")
      await postLogToSlack(
        `OG Image Generation Error: ${new URL(url).pathname} on ${new URL(url).host}\n${message}`,
        webhookUrl
      )
    }
  }
}

/**
 * 静的アセットフェッチャーアダプターを作成
 * @param assets - Cloudflare ASSETS binding
 * @returns アセットフェッチャーアダプター実装
 */
export const createAssetFetcherAdapter = (
  assets: Fetcher
): AssetFetcherAdapter => {
  return {
    async fetchAsset(request: Request): Promise<Response> {
      return await assets.fetch(request)
    }
  }
}

/**
 * HTMLパーサーアダプターを作成
 * @returns HTMLパーサーアダプター実装
 */
export const createHtmlParserAdapter = (): HtmlParserAdapter => {
  return {
    async parseMetadata(response: Response): Promise<PostMetadata> {
      const postMetadata: PostMetadata = {
        title: "",
        imageUrl: ""
      }

      const rewriter = new HTMLRewriter()

      await rewriter
        .on("meta", {
          element(element: Element) {
            const property = element.getAttribute("property")
            const content = element.getAttribute("content") || ""

            switch (property) {
              case "og:title":
                postMetadata.title = content
                break
              case "og:image":
                postMetadata.imageUrl = content
                break
              default:
                break
            }
          }
        })
        .transform(response)
        .arrayBuffer()

      return postMetadata
    }
  }
}

/**
 * 画像ジェネレーターアダプターを作成
 * @returns 画像ジェネレーターアダプター実装
 */
export const createImageGeneratorAdapter = (): ImageGeneratorAdapter => {
  return {
    async generateImage(
      title: string,
      imageUrl: string,
      currentHost: string
    ): Promise<Response> {
      // 循環依存を回避するために動的インポート
      const { ogImage } = await import("../services/ogImage")
      return await ogImage(title, imageUrl, currentHost)
    }
  }
}
