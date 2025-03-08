/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        primary: "#333333",
        accent: "#0066cc"
      },
      typography: {
        xs: {
          css: {
            fontSize: "0.85rem", // ベースサイズを少し大きくする
            p: {
              fontSize: "0.85rem", // 本文フォントサイズを大きくする
              lineHeight: "1.75",
              marginTop: "0.8em",
              marginBottom: "1.5em"
            },
            h1: {
              fontSize: "1.5rem"
            },
            h2: {
              fontSize: "1.25rem"
            },
            // レスポンシブ性を維持するための追加設定
            [`@media (max-width: 640px)`]: {
              fontSize: "0.85rem", // モバイルでも同じサイズを維持
              p: {
                fontSize: "0.85rem" // モバイルでも同じサイズを維持
              }
            }
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
}
