import React from "react"
import { PageProps, graphql } from "gatsby"
import { getSrc } from "gatsby-plugin-image"
import {
  Box,
  Text,
  Divider,
  Heading,
  HStack,
  Td,
  Tr,
  Thead,
  Tbody
} from "@chakra-ui/react"
import { CalendarIcon } from "@chakra-ui/icons"
import { MDXProvider } from "@mdx-js/react"
import { parseISO, format } from "date-fns"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Share from "../components/molecules/share"
import PostTag from "../components/molecules/postTag"
import PrevAndNextPost from "../components/molecules/prevAndNextpost"
import TagList from "../components/molecules/tagList"
import RelatedPosts from "../components/organisms/relatedPosts"
import LinkBox from "../mdx/linkBox"
import { convertMdxDateToIsoJstDate } from "../utils/convertMdxDateToIsoJstDate"
import { PositiveBox } from "../mdx/positive"
import { NegativeBox } from "../mdx/negative"
import { MdxLink } from "../mdx/atoms/link"
import { MdxListLi, MdxListOl, MdxListUl } from "../mdx/atoms/list"
import { MdxH2, MdxH3, MdxH4, MdxParagraph } from "../mdx/atoms/paragraph"
import { MdxCaption, MdxImage } from "../mdx/atoms/image"
import { MdxTable } from "../mdx/atoms/table"

const components = {
  LinkBox,
  PositiveBox,
  NegativeBox,
  a: MdxLink,
  p: MdxParagraph,
  ul: MdxListUl,
  ol: MdxListOl,
  li: MdxListLi,
  img: MdxImage,
  figcaption: MdxCaption,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  table: MdxTable,
  td: Td,
  tr: Tr,
  thead: Thead,
  Tbody: Tbody
}

const BlogPostTemplate: React.FunctionComponent<
  PageProps<Queries.BlogPostBySlugQuery, Queries.MdxEdge>
> = ({ pageContext, data, location, children }) => {
  const post = data.mdx
  const siteTitle = data.site.siteMetadata?.title
  const jstIsoDate = convertMdxDateToIsoJstDate(post.frontmatter.date)
  const parsedDate = parseISO(jstIsoDate)
  const formattedDate = format(parsedDate, "yyyy-MM-dd")
  const { previous, next } = pageContext
  const relatedPostsComponent =
    post.frontmatter.tags != null ? (
      <RelatedPosts tag={post.frontmatter.tags[0]} id={post.id} />
    ) : null

  return (
    <Layout location={location} title={siteTitle}>
      <Box outline="none" width="100%">
        <article>
          <Box as="header" p={1}>
            <time dateTime={formattedDate}>
              <HStack pt={1}>
                <CalendarIcon />
                <Text color="GrayText" fontSize="sm">
                  {formattedDate}
                </Text>
              </HStack>
            </time>
            <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }}>
              {post.frontmatter.title}
            </Heading>
            <PostTag tags={post.frontmatter.tags} />
          </Box>
          <Divider marginY={2} />
          <Box
            className="post-body"
            fontSize={{ base: "15px", md: "17px" }}
            paddingX={2}
          >
            <MDXProvider components={components}>{children}</MDXProvider>
          </Box>
        </article>
        <Divider />
        <Share title={post.frontmatter.title} location={location} />
      </Box>
      <PrevAndNextPost previous={previous} next={next} />
      <Divider my={2} />
      {relatedPostsComponent}
      <TagList />
    </Layout>
  )
}

export default BlogPostTemplate

export const Head = ({ data, location }) => {
  const post = data.mdx
  const jstIsoDate = convertMdxDateToIsoJstDate(post.frontmatter.date)
  const seoImage =
    post.frontmatter.cover != undefined
      ? getSrc(post.frontmatter.cover.childImageSharp.gatsbyImageData)
      : "/image/dummy.jpg"

  return (
    <SEO
      title={post.frontmatter.title}
      description={post.excerpt}
      image={seoImage}
      location={location}
      datePublished={jstIsoDate}
    />
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        date
        title
        tags
        cover {
          childImageSharp {
            gatsbyImageData(
              quality: 40
              width: 1200
              formats: [AUTO]
              breakpoints: 1200
            )
          }
        }
      }
      excerpt(pruneLength: 250)
      id
    }
  }
`
