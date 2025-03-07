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
            fontSize: "0.80rem", // または必要なサイズ
            p: {
              fontSize: "0.75rem",
              lineHeight: "1.75",
              marginTop: "0.8em",
              marginBottom: "1.5em"
            },
            h1: {
              fontSize: "1.5rem"
            },
            h2: {
              fontSize: "1.25rem"
            }
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
}
