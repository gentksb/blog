import React from "react"
import { PageProps, graphql } from "gatsby"
import { VStack } from "@chakra-ui/react"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Pagination from "../components/molecules/pagination"
import PostList from "../components/organisms/postList"
import TagList from "../components/molecules/tagList"
import { convertMdxDateToIsoJstDate } from "../utils/convertMdxDateToIsoJstDate"
import { PaginationContext } from "../../gatsby-node"

const BlogIndex: React.FunctionComponent<
  PageProps<Queries.IndexPageQuery, PaginationContext>
> = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMdx.edges

  return (
    <Layout location={location} title={siteTitle}>
      <VStack maxW="100%">
        <PostList edges={edges} />
        <Pagination paginationdata={pageContext} />
        <TagList />
      </VStack>
    </Layout>
  )
}

export default BlogIndex

export const Head = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata.title
  const { pageNumber } = pageContext
  const pageTitle = pageNumber > 0 ? `Old posts page ${pageNumber}` : siteTitle
  const buildJstIsoTime = convertMdxDateToIsoJstDate(
    data.siteBuildMetadata.buildTime
  )
  return (
    <SEO
      title={pageTitle}
      location={location}
      description={data.site.siteMetadata.description}
      datePublished={buildJstIsoTime}
    />
  )
}

export const pageQuery = graphql`
  query IndexPage($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMdx(
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
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
                gatsbyImageData(aspectRatio: 1.77, quality: 40, width: 800)
              }
            }
            tags
            draft
          }
        }
      }
    }
    siteBuildMetadata {
      buildTime
    }
  }
`
