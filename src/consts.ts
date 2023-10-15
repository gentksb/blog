import type { Redirect } from "./redirects"

export const SITE_TITLE = "幻想サイクル"
export const SITE_DESCRIPTION =
  "AJOCC C1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです"
export const SITE_URL = "https://blog.gensobunya.net/"
export const PROFILE = {
  social: {
    twitter: "gen_sobunya",
    github: "gentksb",
    instagram: "gen_sobunya",
    threads: "gen_sobunya"
  }
}

export const redirectData: Redirect[] = [
  {
    source: "/tag/*",
    destination: "/tags/*",
    type: 301
  },
  {
    source: "/category/*",
    destination: "/tags/*",
    type: 301
  },
  {
    source: "/categories/*",
    destination: "/tags/*",
    type: 301
  },
  {
    source: "/search/label/*",
    destination: "/tags/*",
    type: 301
  },
  // {
  //   source: "/*/feed",
  //   destination: "/*/index.xml",
  //   type: 301
  // },
  {
    source: "/2015/05/12/flo-disc-whee.html",
    destination: "/post/2015/05/flo-impression/",
    type: 301
  },
  {
    source: "/2016/01/05/blog-post_83.html",
    destination: "/post/2016/01/hydrohealing/",
    type: 301
  },
  {
    source: "/2016/01/zwift-mobile-link.html",
    destination: "/post/2016/01/zwift-mobile-link/",
    type: 301
  },
  {
    source: "/2016/01/zwift0-ftp-testshorter.html",
    destination: "/post/2016/01/zwift-ftp-test/",
    type: 301
  },
  {
    source: "/2016/01/zwift1-6wks-ftp-builder-week-1-day-1.html",
    destination: "/post/2016/01/zwift-6wks-ftp-builder-week-1-day-1/",
    type: 301
  },
  {
    source: "/2016/01/zwift1-6wks-ftp-builder-week-1-day-2.html",
    destination: "/post/2016/01/zwift-6wks-ftp-builder-week-1-day-2/",
    type: 301
  },
  {
    source: "/2016/01/zwift3-6wks-ftp-builder-week-1-day-3.html",
    destination: "/post/2016/01/zwift-6wks-ftp-builder-week-1-day-3/",
    type: 301
  },
  {
    source: "/2016/01/zwift4-6wks-ftp-builder-week-1-day-4.html",
    destination: "/post/2016/01/zwift-6wks-ftp-builder-week-1-day-4/",
    type: 301
  },
  {
    source: "/2016/01/zwift6-6wks-ftp-builder-week-2-day-1.html",
    destination: "/post/2016/01/zwift-6wks-ftp-builder-week-2-day-1/",
    type: 301
  },
  {
    source: "/2016/02/zwift6-6wks-ftp-builder-week-2-day-2.html",
    destination: "/post/2016/02/zwift-6wks-ftp-builder-week-2-day-2/",
    type: 301
  },
  {
    source: "/2016/02/zwift6-6wks-ftp-builder-week-2-day-3-5.html",
    destination: "/post/2016/02/zwift-6wks-ftp-builder-week-2-day-3-5/",
    type: 301
  },
  {
    source: "/2016/02/zwift11-6wks-ftp-builder-week-3-day-1.html",
    destination: "/post/2016/02/zwift-6wks-ftp-builder-week-3-day-1/",
    type: 301
  },
  {
    source: "/2016/02/zwift12-13-6wks-ftp-builder-week-3-day.html",
    destination: "/post/2016/02/zwift-6wks-ftp-builder-week-3-day-2-3/",
    type: 301
  },
  {
    source: "/2016/08/di2_24.html",
    destination: "/post/2016/08/di2drill_2/",
    type: 301
  },
  {
    source: "/2016/08/st-r785mtbcx.html",
    destination: "/post/2016/08/st-r785mtbcx/",
    type: 301
  },
  {
    source: "/2016/10/tcr-advanced-pro-disc.html",
    destination: "/post/2016/10/tcr-advanced-pro-disc/",
    type: 301
  },
  {
    source: "/2016/12/maxxis-speed-terrane.html",
    destination: "/post/2016/12/maxxis-speed-terrane_view/",
    type: 301
  },
  {
    source: "/2016/12/maxxis-speed-terrane_11.html",
    destination: "/post/2016/12/maxxis-speed-terrane_ride/",
    type: 301
  },
  {
    source: "/2017/04/mtbesi-grips-brand-x-ascend-dropper-post.html",
    destination: "/post/2017/04/goodmtbgears/",
    type: 301
  },
  {
    source: "/2017/08/blog-post.html",
    destination: "/post/2017/08/ducttape_1/",
    type: 301
  },
  {
    source: "/2017/06/cs-hg-800-11wh-rs770.html",
    destination: "/post/2017/06/cs-hg-800-11wh-rs770/",
    type: 301
  },
  {
    source: "/201710/2017zwift-mobile-link.html",
    destination: "/post/2017/10/2017zwift-mobile-link/",
    type: 301
  },
  {
    source: "/post/2017/10/blgger-to-wp-to-hugo-1/",
    destination: "http://www.gensobunya.net/portfolio/blgger-to-wp-to-hugo-1/",
    type: 301
  },
  {
    source: "/post/2017/10/blggrtowp-2/",
    destination: "http://www.gensobunya.net/portfolio/blggrtowp-2/",
    type: 301
  },
  {
    source: "/post/2017/11/wp2hugo/",
    destination: "http://www.gensobunya.net/portfolio/wp2hugo/",
    type: 301
  },
  {
    source: "/post/2019/01/boa_repair/",
    destination: "/post/2019/02/boa_repair/",
    type: 301
  },
  {
    source: "/post/2019/07/withings2slack/",
    destination:
      "https://gensobunya-tech.hatenablog.com/entry/2019/07/19/000000",
    type: 301
  },
  {
    source: "/post/2021/10/disc_clearner/",
    destination: "/post/2021/10/disc_cleaner/",
    type: 301
  },
  {
    source: "/post/2022/01/",
    destination: "/post/2022/01/doping/",
    type: 301
  },
  {
    source: "/post/2022/11/revale_af/",
    destination: "/post/2022/11/rivale_mips/",
    type: 301
  },
  {
    source: "/2012/11/TTposition_on_road.html",
    destination: "/post/2012/11/TTposition_on_road/",
    type: 301
  },
  {
    source: "/2016/09/2016-17-cx1-irc-tire-90th-anniversary.html",
    destination: "/post/2016/09/irc90thcup/",
    type: 301
  },
  {
    source: "/201807/2018-07-12-cxtublar.html",
    destination: "/post/2018/07/cxtublar/",
    type: 301
  },
  {
    source: "/2015/10/01/zwif-3.html",
    destination: "/post/2015/10/zwiftstart/",
    type: 301
  },
  {
    source: "/201711/2017-11-22-sdawinter.html",
    destination: "/post/2017/11/SdaWinter/",
    type: 301
  },
  {
    source: "/201808/2018-07-29-iwatake.html",
    destination: "/post/2018/07/iwatake/",
    type: 301
  },
  {
    source: "/2013/11/bar-fly20.html",
    destination: "/post/2013/11/bar-fly2/",
    type: 301
  },
  {
    source: "/2014/05/2014-sda.html",
    destination: "/post/2014/05/sdaspring/",
    type: 301
  },
  {
    source: "/2016/03/zwift.html",
    destination: "/post/2016/03/zwift_env/",
    type: 301
  },
  {
    source: "/2016/08/di2.html",
    destination: "/post/2016/08/di2drill_1/",
    type: 301
  },
  {
    source: "/2017/05/2017.html",
    destination: "/post/2017/05/sdaspring/",
    type: 301
  },
  {
    source: "/2014/12/27/flo-disc.html",
    destination: "/post/2014/12/27/flo-disc/",
    type: 301
  },
  {
    source: "/2016/07/blog-post.html",
    destination: "/post/2016/07/hybrid_trainer/",
    type: 301
  },
  {
    source: "/2017/04/my-protein.html",
    destination: "/post/2017/04/myprotein/",
    type: 301
  },
  {
    source: "/2016/09/choice.html",
    destination: "/post/2016/09/choice/",
    type: 301
  },
  {
    source: "/201807/2018-07-12-cxtublar.html",
    destination: "/post/2018/07/cxtublar/",
    type: 301
  },
  {
    source: "/post/2017zwift-mobile-link.html",
    destination: "/post/2017/10/2017zwift-mobile-link/",
    type: 301
  },
  {
    source: "/2015/10/01/zwif-3.html",
    destination: "/post/2015/10/zwiftstart/",
    type: 301
  }
]
