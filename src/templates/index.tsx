import React from "react"
import { PageProps, graphql } from "gatsby"
import { VStack } from "@chakra-ui/react"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Pagination from "../components/molecules/pagination"
import PostList from "../components/organisms/postList"
import TagList from "../components/molecules/tagList"
import { convertMdxDateToIsoJstDate } from "../utils/convertMdxDateToIsoJstDate"

const BlogIndex: React.FunctionComponent<
  PageProps<GatsbyTypes.IndexPageQuery, GatsbyTypes.SitePage["pageContext"]>
> = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMdx.edges
  const buildJstIsoTime = convertMdxDateToIsoJstDate(
    data.siteBuildMetadata.buildTime
  )

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title="幻想サイクル"
        location={location}
        description={data.site.siteMetadata.description}
        datePublished={buildJstIsoTime}
      />
      <VStack maxW="100%">
        <PostList edges={edges} />
        <Pagination props={props.pageContext} />
        <TagList />
      </VStack>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexPage($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
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
