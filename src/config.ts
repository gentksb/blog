export const pageSize = 12

export type FeaturedGroup = {
  title: string
  description?: string
  slugs: string[]
}

export const featuredGroups: FeaturedGroup[] = [
  {
    title: "ガーミンウォッチ活用",
    description:
      "Forerunnerシリーズを使ったサイクリング・筋トレへの活用法を紹介",
    slugs: [
      "2024/09/forerunner965",
      "2023/04/garmin_gym_workout_detection",
      "2023/02/clean_handlebar"
    ]
  },
  {
    title: "CXチューブラー沼",
    description: "シクロクロスのタイヤ・ホイール・メンテナンスを徹底解説",
    slugs: [
      "2023/02/cxtu-easy-mount-test",
      "2024/09/2024-vittoria-dugast",
      "2024/06/tubular-wheel-cleaning",
      "2022/10/2022_cx_tire"
    ]
  },
  {
    title: "Zwiftトレーニング",
    description: "インドアサイクリング機材やバーチャルシフト追求について",
    slugs: [
      "2025/02/qz-virtual-shifting-in-zwift",
      "2025/10/kickr-core2-review",
      "2025/02/trainingpeaks-virtual-trial",
      "2024/04/easy-pm-compare-zwiftpower"
    ]
  }
]
