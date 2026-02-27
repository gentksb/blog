export const pageSize = 12

export type FeaturedGroup = {
  title: string
  description?: string
  slugs: string[]
}

export const featuredGroups: FeaturedGroup[] = [
  {
    title: "ガーミンウォッチ活用術",
    description: "Forerunnerシリーズの筋トレ・ワークアウト検出を深掘り",
    slugs: [
      "2024/09/forerunner965",
      "2023/10/smartlock-and-smartwatch",
      "2023/08/c102",
      "2024/09/patanity-cyclist-time-performance"
    ]
  },
  {
    title: "CXチューブラー沼",
    description: "シクロクロスのタイヤ・ホイール・メンテナンスを徹底解説",
    slugs: [
      "2024/09/2024-vittoria-dugast",
      "2024/06/tubular-wheel-cleaning",
      "2025/06/gravelking-x1r-review",
      "2024/03/gravelking-x1"
    ]
  },
  {
    title: "Zwiftトレーニング",
    description: "インドアサイクリングでFTPを高めるワークアウト記録",
    slugs: [
      "2016/01/zwift-ftp-test",
      "2016/03/zwift_env",
      "2016/05/zwft_orig_workout",
      "2015/10/zwiftstart"
    ]
  }
]
