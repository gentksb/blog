import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    heroImage: z.string().optional()
  })
})

const post = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date().transform((val) => new Date(val)),
      draft: z.boolean().optional(),
      tags: z.string().array().min(1),
      cover: image()
    })
})

export const collections = { blog, post }
