import React from "react"
import { PageProps, graphql } from "gatsby"
import { VStack } from "@chakra-ui/react"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import PostList from "../components/organisms/postList"
import TagList from "../components/molecules/tagList"

type PageContext = {
  tag: string
}

const Tags: React.FunctionComponent<
  PageProps<Queries.TagPageQuery, PageContext>
> = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges } = data.allMdx
  const pageTitle = `Tag search : ${tag}`
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={pageTitle} location={location} />
      <VStack maxW="100%">
        <TagList targetTag={tag} />
        <PostList edges={edges} />
      </VStack>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date
            title
            cover {
              childImageSharp {
                gatsbyImageData(aspectRatio: 1.77)
              }
            }
            tags
            draft
          }
        }
      }
    }
  }
`
