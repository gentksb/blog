import { parse, resolve } from "node:path"
import type { Plugin } from "vite"

function resolveModulePath(path: string): string {
  if (path.startsWith(".")) return resolve(path)
  return path
}

function getDefaultImportName(path: string): string {
  return parse(path).name.replaceAll(/[^\w\d]/g, "")
}

export function mdxAutoImport(imports: string[]): Plugin {
  const importStatements = imports
    .map((p) => {
      const resolved = resolveModulePath(p)
      const name = getDefaultImportName(p)
      return `import ${name} from ${JSON.stringify(resolved)};`
    })
    .join("\n")

  return {
    name: "mdx-auto-import",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".mdx")) return
      const firstFm = code.indexOf("---")
      if (firstFm === -1) return importStatements + "\n" + code
      const secondFm = code.indexOf("---", firstFm + 3)
      if (secondFm === -1) return importStatements + "\n" + code
      const insertAt = secondFm + 3
      return (
        code.slice(0, insertAt) +
        "\n" +
        importStatements +
        "\n" +
        code.slice(insertAt)
      )
    }
  }
}
