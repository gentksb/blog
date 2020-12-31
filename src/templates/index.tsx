import React from "react"
import { PageProps, graphql } from "gatsby"
import { IndexPageQuery,SitePageContext } from '../../types/graphql-types'
import { VStack } from "@chakra-ui/react"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"
import Pagination from "../components/molecules/pagination"
import PostList from "../components/organisms/postList"
import TagList from "../components/molecules/tagList"

const BlogIndex: React.FunctionComponent<PageProps<IndexPageQuery, SitePageContext>> = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Top" location={location} />
      <VStack>
          <PostList props={edges} />
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
      }
    }
    allMarkdownRemark(
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
            date(formatString: "MMMM DD, YYYY")
            title
            cover {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
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
