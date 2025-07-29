import type { AstroConfig, ExternalImageService, ImageTransform } from "astro"
import { baseService } from "astro/assets"

export interface CloudflareImageServiceConfig {
  maxWidth?: number
  quality?: number
}

const service: ExternalImageService = {
  ...baseService,
  validateOptions(options: ImageTransform, imageConfig: AstroConfig["image"]) {
    const serviceConfig = imageConfig.service.config

    // Enforce the user set max width.
    if (options.width ?? 0 > serviceConfig.maxWidth) {
      console.warn(
        `Image width ${options.width} exceeds max width ${serviceConfig.maxWidth}. Falling back to max width.`
      )
      options.width = serviceConfig.maxWidth
    }

    return options
  },

  getURL(options: ImageTransform): string {
    const { src: imageSrc, width, height, format, quality = 80, fit } = options
    // "jpg" to "jpeg" on format
    const cfFormat = format === "jpg" ? "jpeg" : format

    // Cloudflare Image Resizingのオプションを構築
    const cfOptions: string[] = []

    if (width) cfOptions.push(`width=${width}`)
    if (height) cfOptions.push(`height=${height}`)
    if (format) cfOptions.push(`format=${cfFormat}`)
    if (quality) cfOptions.push(`quality=${quality}`)
    if (fit) cfOptions.push(`fit=${fit}`)

    // ソース画像のパスを取得（URLの場合はそのまま使用）
    // ImageMetaData以外の画像の場合、自サイトドメインのみ許可
    if (
      typeof imageSrc === "string" &&
      !imageSrc.startsWith("https://blog.gensobunya.net/")
    ) {
      throw new Error("External image source URL in Astro Image component")
    }
    const sourcePath = typeof imageSrc === "string" ? imageSrc : imageSrc.src
    const baseUrl = import.meta.env.BASE_URL
      ? `${import.meta.env.BASE_URL}`
      : ""
    // Cloudflare Image ResizingのURL形式に変換
    const imagePath = `${baseUrl}/cdn-cgi/image/${cfOptions.join(",")}${sourcePath}`
    // console.log(
    //   `baseUrl: ${baseUrl}`,
    //   `sourcePath: ${sourcePath}`,
    //   `cfOptions: ${cfOptions}`,
    //   `rawPath: ${imagePath}`,
    //   "if LeadingSlash, will remove it"
    // )

    // @cloudflare/internal-helperの実装を参考に
    return imagePath.startsWith("/") ? imagePath.substring(1) : imagePath
  }
}

export default service
