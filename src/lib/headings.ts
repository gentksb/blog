import type { MarkdownHeading } from "astro"

export interface TocHeading extends MarkdownHeading {
  children: TocHeading[]
}

/**
 * フラットな見出しリストから階層構造を持つ目次を生成
 */
export function buildToc(headings: MarkdownHeading[]): TocHeading[] {
  const toc: TocHeading[] = []
  const stack: TocHeading[] = []

  headings.forEach((heading) => {
    const tocHeading: TocHeading = { ...heading, children: [] }

    // スタックから現在の見出しより深いレベルを取り除く
    while (stack.length > 0 && stack[stack.length - 1].depth >= tocHeading.depth) {
      stack.pop()
    }

    // 親が存在する場合は子として追加、存在しない場合はルートに追加
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(tocHeading)
    } else {
      toc.push(tocHeading)
    }

    stack.push(tocHeading)
  })

  return toc
}

/**
 * 見出しのdepthに応じたインデントクラスを返す
 */
export function getIndentClass(depth: number): string {
  const indentMap: Record<number, string> = {
    1: "",
    2: "",
    3: "pl-4",
    4: "pl-8",
    5: "pl-12",
    6: "pl-16"
  }
  return indentMap[depth] || ""
}
