import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
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
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  },
  ...astro.configs['flat/recommended'],
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
      "src/content/post/**/*.mdx",
      "src/components/text/**/*.md",
      "README.md",
      "dist/",
      "node_modules/"
    ]
  },
  prettier
];