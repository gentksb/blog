import { toString } from "hast-util-to-string"
import { truncate, type Options } from "hast-util-truncate"

/** @type {import('unified').Plugin<[Options]>} */
export function rehypeExcerptContent(
  options: Options = { ellipsis: "…" }
):
  | void
  | import("unified").Transformer<import("hast").Root, import("hast").Root> {
  return function (tree, { data }) {
    const truncatedTree = truncate(tree, { ellipsis: "…", ...options })
    const excerpt = toString(truncatedTree).replaceAll(/\s/g, " ")
    // @ts-ignore See https://docs.astro.build/en/guides/markdown-content/#modifying-frontmatter-programmatically
    data.astro.frontmatter.excerpt = excerpt
  }
}
