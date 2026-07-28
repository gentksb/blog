import { parse, resolve } from "node:path"

function resolveModulePath(path: string): string {
  if (path.startsWith(".")) return resolve(path)
  return path
}

function getDefaultImportName(path: string): string {
  return parse(path).name.replaceAll(/[^\w\d]/g, "")
}

export function mdxAutoImport(imports: string[]) {
  const importStatements = imports
    .map((p) => {
      const resolved = resolveModulePath(p)
      const name = getDefaultImportName(p)
      return `import ${name} from ${JSON.stringify(resolved)};`
    })
    .join("\n")

  return {
    name: "mdx-auto-import",
    enforce: "pre" as const,
    transform(code: string, id: string) {
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
