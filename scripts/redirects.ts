// ESM import
import { redirectData } from "~/consts.js"
// import Node.js fs
import { writeFile } from "fs/promises"

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
    await writeFile("public/_redirects", content, "utf8")
    console.log("Redirects file written successfully")
  } catch (error) {
    console.error("Error writing redirects file", error)
  }
}

// output "_redirect" local file with Node.js
writeRedirectFile(redirectData)
