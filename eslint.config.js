import js from "@eslint/js"
import globals from "globals"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"
import astro from "eslint-plugin-astro"
import tailwindcss from "eslint-plugin-tailwindcss"
import prettier from "eslint-config-prettier"

export default [
  js.configs.recommended,
  // TypeScript files configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      tailwindcss
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-unused-vars": "off", // TypeScriptでは@typescript-eslint版を使用
      "no-undef": "off" // TypeScriptコンパイラが処理するため無効化
    }
  },
  // JavaScript files configuration
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      tailwindcss
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-undef": "error" // JavaScriptファイルでは有効のまま
    }
  },
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    ignores: [
      "**/*.d.ts", // 型定義ファイルを完全に除外
      "src/content/post/**/*.mdx",
      "src/components/text/**/*.md",
      "README.md",
      "dist/",
      "node_modules/"
    ]
  },
  prettier
]
