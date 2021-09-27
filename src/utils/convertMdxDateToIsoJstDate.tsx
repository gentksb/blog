import { utcToZonedTime } from "date-fns-tz"
import { formatISO, sub } from "date-fns"

//GatsbyjsがMarkdownのDateをUTCで扱ってしまうため、JSTのISO時間表記に変更して返す

export const convertMdxDateToIsoJstDate = (mdxFrontMatterDate: string) => {
  const JstDate = utcToZonedTime(mdxFrontMatterDate, "Asia/Tokyo")
  const adjustedDate = sub(JstDate, { hours: 9 })
  const IsoJstDate = formatISO(adjustedDate)
  console.log("current: ", IsoJstDate)

  return IsoJstDate
}
