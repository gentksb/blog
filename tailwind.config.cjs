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
        amazon: "#ff9900",
        yahoo: "#FF0033",
        rakuten: "#BF0000"
      }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      corporate: {
        ...require("daisyui/src/theming/themes")["[data-theme=corporate]"],
        "accent": "#3182CE", // アクセントカラーを上書き
        "accent-content": "#FFFFFF", // アクセントカラー上のテキスト色
      }
    }]
  }
}
