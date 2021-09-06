import React from "react"
import { PageProps, graphql } from "gatsby"
import { getSrc } from "gatsby-plugin-image"
import { Box, Text, Divider, Heading, HStack } from "@chakra-ui/react"
import { CalendarIcon } from "@chakra-ui/icons"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"
import moment, { ISO_8601 } from "moment"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Share from "../components/molecules/share"
import PostTag from "../components/molecules/postTag"
import PrevAndNextPost from "../components/molecules/prevAndNextpost"
import TagList from "../components/molecules/tagList"
import RelatedPosts from "../components/organisms/relatedPosts"
import BlogPostStyle from "../styles/blog-post.style"
import LinkBox from "../mdx/linkBox"

const shortcodes = {
  LinkBox
}

const BlogPostTemplate: React.FunctionComponent<
  PageProps<GatsbyTypes.BlogPostBySlugQuery, GatsbyTypes.SitePageContext>
> = (props) => {
  const { pageContext, data, location } = props
  const post = data.mdx
  const siteTitle = data.site.siteMetadata?.title
  const momentPostDate = moment(post.frontmatter.date)
    .utcOffset(9)
    .subtract(9, "hours")
  console.log(`master time is: ${momentPostDate.toISOString(true)}`)
  const jstIsoDate = momentPostDate.toISOString(true)
  const formattedDate = momentPostDate.format("YYYY-MM-DD")
  const { previous, next } = pageContext
  const seoImage =
    post.frontmatter.cover != undefined
      ? getSrc(post.frontmatter.cover.childImageSharp.gatsbyImageData)
      : "/image/dummy.jpg"
  const relatedPostsComponent =
    post.frontmatter.tags != null ? (
      <RelatedPosts tag={post.frontmatter.tags[0]} id={post.id} />
    ) : null

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={seoImage}
        location={location}
        datePublished={jstIsoDate}
      />
      <Box outline="none" width="100%">
        <article>
          <header>
            <time dateTime={formattedDate} itemProp="datepublished">
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
          </header>
          <Divider />
          <Box className="post-body" css={BlogPostStyle}>
            <MDXProvider components={shortcodes}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
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

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      body
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
      excerpt(truncate: true, pruneLength: 250)
      id
    }
  }
`
