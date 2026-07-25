import { expect, test } from "vitest"
import { DIRECTIVES, isDirectiveName } from "../../src/lib/directives"

test("定義済みのディレクティブ名を受け付ける", () => {
  for (const name of Object.keys(DIRECTIVES)) {
    expect(isDirectiveName(name)).toBe(true)
  }
})

test("未定義のディレクティブ名を拒否する", () => {
  expect(isDirectiveName("warning")).toBe(false)
})

test("Object.prototype 由来のプロパティ名を拒否する", () => {
  for (const name of ["toString", "constructor", "valueOf", "hasOwnProperty"]) {
    expect(isDirectiveName(name)).toBe(false)
  }
})
