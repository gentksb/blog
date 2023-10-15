import { defineCollection, z } from "astro:content"

const post = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date().transform((val) => new Date(val)),
      draft: z.boolean().optional(), // 歴史的経緯で必須ではない
      tags: z.string().array().min(1),
      cover: image()
    })
})

const singlePage = defineCollection({
  schema: () =>
    z.object({
      title: z.string()
    })
})

export const collections = { post, singlePage }
