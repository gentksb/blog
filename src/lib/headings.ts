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
