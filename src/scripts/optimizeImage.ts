import sharp from "sharp"
import { glob } from "glob"
import fs from "fs-extra"

const matches = glob.sync(`src/content/post/**/*.{png,jpg,jpeg}`)
// 実行場所からの相対パスで指定する
console.dir(matches, { maxArrayLength: null })
const MAX_WIDTH = 1800
const QUALITY = 100

Promise.all(
  matches.map(async (match) => {
    const stream = sharp(match)
    const info = await stream.metadata()

    if (info.width === undefined || info.width < MAX_WIDTH) {
      console.log(`Skipping ${match} because is is too small`)
      return
    }

    const optimizedName = match.replace(
      /(\..+)$/,
      (match, ext) => `-optimized${ext}`
    )
    console.log(`Optimizing ${match} to ${optimizedName}`)
    await stream
      .resize(MAX_WIDTH)
      .jpeg({ quality: QUALITY })
      .toFile(optimizedName)

    return fs.rename(optimizedName, match)
  })
)
