import React from "react"
import { PageProps, graphql } from "gatsby"
import { VStack } from "@chakra-ui/react"
import moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Pagination from "../components/molecules/pagination"
import PostList from "../components/organisms/postList"
import TagList from "../components/molecules/tagList"

const BlogIndex: React.FunctionComponent<
  PageProps<GatsbyTypes.IndexPageQuery, GatsbyTypes.SitePageContext>
> = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMdx.edges
  const buildJstIsoTime = moment(data.siteBuildMetadata.buildTime)
    .utcOffset(9)
    .toISOString(true)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title="幻想サイクル"
        location={location}
        description={data.site.siteMetadata.description}
        datePublished={buildJstIsoTime}
      />
      <VStack>
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
                gatsbyImageData(aspectRatio: 1.77, quality: 40)
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
