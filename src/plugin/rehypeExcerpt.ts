import { toString } from "hast-util-to-string"
import { truncate, type Options } from "hast-util-truncate"

/** @type {import('unified').Plugin<[Options]>} */
export function rehypeExcerptContent(options: Options = { ellipsis: "…" }) {
  // @ts-expect-error See https://docs.astro.build/en/guides/markdown-content/#modifying-frontmatter-programmatically
  return function (tree, { data }) {
    const truncatedTree = truncate(tree, { ellipsis: "…", ...options })
    const excerpt = toString(truncatedTree).replaceAll(/\s/g, " ")

    data.astro.frontmatter.excerpt = excerpt
  }
}

// Thanks https://www.tunamaguro.dev/articles/astro-markdown-content-excerpt/
