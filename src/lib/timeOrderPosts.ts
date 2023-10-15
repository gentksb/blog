import { getCollection } from "astro:content"

export const timeOrderPosts = (await getCollection("post")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
)
