import moment from "moment"

//GatsbyjsがMarkdownのDateをUTCで扱ってしまうため、JSTのISO時間表記に変更して返す

export const convertMdxDateToIsoJstDate = (mdxFrontMatterDate: string) => {
  const IsoJstDate = moment(mdxFrontMatterDate)
    .utcOffset(9)
    .subtract(9, "hours")
    .toISOString(true)

  return IsoJstDate
}
