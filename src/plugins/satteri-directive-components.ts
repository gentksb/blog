import { defineMdastPlugin } from "satteri"
import type { MdxJsxFlowElement } from "satteri"

import { DIRECTIVES, isDirectiveName } from "../lib/directives"

export function directiveComponentPlugin() {
  return defineMdastPlugin({
    name: "directive-components",
    containerDirective(node) {
      if (!isDirectiveName(node.name)) return

      return {
        type: "mdxJsxFlowElement",
        name: DIRECTIVES[node.name].component,
        attributes: [],
        children: node.children
      } satisfies MdxJsxFlowElement
    }
  })
}
