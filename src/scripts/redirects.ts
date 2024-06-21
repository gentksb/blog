// ESM import
import { redirectData } from "../consts.js"
// import Bun
import * as Bun from "bun"

export type Redirect = {
  source: string
  destination: string
  type: number
}

const writeRedirectFile = async (redirectData: Redirect[]) => {
  const content = redirectData
    .map(
      (redirect) =>
        `${redirect.source} ${redirect.destination.replace("*", ":splat")} ${
          redirect.type
        }`
    )
    .join("\n")

  try {
    await Bun.write("public/_redirects", content)
    console.log("Redirects file written successfully")
  } catch (error) {
    console.error("Error writing redirects file", error)
  }
}

// output "_redirect" local file with bun
writeRedirectFile(redirectData)
