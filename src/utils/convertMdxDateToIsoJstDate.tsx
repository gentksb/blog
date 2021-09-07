import moment from "moment"

//GatsbyjsがMarkdownのDateをUTCで扱ってしまうため、JSTのISO時間表記に変更して返す

export const convertMdxDateToIsoJstDate = (mdxFrontMatterDate: string) => {
  const IsoJstDate = moment
    .utc(mdxFrontMatterDate)
    .utcOffset(9, true)
    .toISOString(true)

  return IsoJstDate
}
