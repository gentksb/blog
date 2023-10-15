// ESM import
import { redirectData } from "./consts.js"
import fs from "fs"
import path from "path"

export type Redirect = {
  source: string
  destination: string
  type: number
}

const makeRedirectsFile = (redirectData: Redirect[]) => {
  const redirectsArray = redirectData.map(
    (redirect) =>
      `${redirect.source} ${redirect.destination.replace("*", ":splat")} ${
        redirect.type
      }`
  )
  return redirectsArray.join("\n")
}

// output "_redirect" local file
const redirectsFile = makeRedirectsFile(redirectData)
const redirectsFilePath = path.join(process.cwd(), "public/_redirects")
fs.writeFileSync(redirectsFilePath, redirectsFile)
