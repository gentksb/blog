import { defineMdastPlugin } from "satteri"
import type { MdxJsxFlowElement } from "satteri"

const DIRECTIVE_TO_COMPONENT: Record<string, string> = {
  positive: "PositiveBox",
  negative: "NegativeBox"
}

export function directiveComponentPlugin() {
  return defineMdastPlugin({
    name: "directive-components",
    containerDirective(node) {
      const componentName = DIRECTIVE_TO_COMPONENT[node.name]
      if (!componentName) return

      return {
        type: "mdxJsxFlowElement",
        name: componentName,
        attributes: [],
        children: node.children
      } satisfies MdxJsxFlowElement
    }
  })
}
