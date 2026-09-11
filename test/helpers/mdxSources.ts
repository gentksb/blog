/**
 * 記事 MDX ソースの共通ローダ。
 * workerd 内では fs を使えないため、ビルド時(Vite)に raw で取り込む。
 */

export const postMdxSources = import.meta.glob(
  "../../src/content/post/**/*.mdx",
  {
    query: "?raw",
    import: "default",
    eager: true
  }
) as Record<string, string>

export const singlePageMdxSources = import.meta.glob(
  "../../src/content/singlePage/**/*.mdx",
  {
    query: "?raw",
    import: "default",
    eager: true
  }
) as Record<string, string>

/** ディレクティブは post / singlePage 双方のレンダリング経路で解決されるため両方を対象にする */
export const allMdxSources = { ...postMdxSources, ...singlePageMdxSources }

export const stripFrontmatter = (source: string): string =>
  source.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, "")

export const stripCodeFences = (source: string): string =>
  source.replace(/```[\s\S]*?```/g, "")
