import { glob } from "astro/loaders"
import { defineCollection, z } from "astro:content"

const post = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/post" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date().transform((val) => new Date(val)),
      draft: z.boolean().optional(), // 歴史的経緯で必須ではない
      tags: z.string().array().min(1),
      cover: image().optional()
    })
})

const singlePage = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/singlePage" }),
  schema: () =>
    z.object({
      title: z.string()
    })
})

export const collections = { post, singlePage }
