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
      "Forerunnerシリーズを使ったサイクリング・筋トレ・ライフログの記録と活用",
    slugs: [
      "2024/09/forerunner965",
      "2023/04/garmin_gym_workout_detection",
      "2023/02/clean_handlebar"
    ]
  },
  {
    title: "CXチューブラータイヤ",
    description:
      "シクロクロス用チューブラータイヤのホイール・メンテナンス・維持運用",
    slugs: [
      "2023/02/cxtu-easy-mount-test",
      "2024/09/2024-vittoria-dugast",
      "2024/06/tubular-wheel-cleaning",
      "2022/10/2022_cx_tire"
    ]
  },
  {
    title: "インドアトレーニング",
    description:
      "インドアサイクリング機材や子供持ち家庭での気兼ねないZwiftトレーニング",
    slugs: [
      "2026/07/cycplus-t7",
      "2025/02/qz-virtual-shifting-in-zwift",
      "2025/10/kickr-core2-review",
      "2025/02/trainingpeaks-virtual-trial",
      "2024/04/easy-pm-compare-zwiftpower"
    ]
  }
]
