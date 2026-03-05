/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["sans-serif"],
        relics: ["Times New Roman", "MS PGothic"],
        ui: ["system-ui", "-apple-system"]
      },
      colors: {
        // セマンティックカラー
        accent: "#9A3412", // orange-800: バッジ・CTA（白文字で4.5:1以上）
        primary: "#B45309", // amber-700: リンク・装飾ボーダー
        secondary: "#78716C", // stone-500: 補助テキスト
        info: "#2563EB", // blue-600
        error: "#DC2626", // red-600
        // サービスカラー
        amazon: "#ff9900",
        yahoo: "#FF0033",
        rakuten: "#BF0000"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
}
