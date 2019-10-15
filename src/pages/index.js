import React from "react"
import { Link,graphql } from "gatsby"
import Img from 'gatsby-image';

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const edges = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        {
          edges.map(({ node }) => (
            <div key={node.id}>
              <Link to={node.fields.slug}>
                <h3>{node.frontmatter.title}</h3>
                <Img
                alt={`${node.frontmatter.title} cover image`}
                style={{ height: '100%' }}
                fluid={node.frontmatter.featuredImage.childImageSharp.fluid}
              />
              </Link>
              <p>{node.frontmatter.date}</p>
              <p>{node.excerpt}</p>
            </div>
          ))
        }
        <Bio />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, limit: 10) {
    edges {
      node {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          featuredImage {
            base
            childImageSharp {
              fluid(maxWidth: 1080) {
                originalName
                srcWebp
                srcSetWebp
                srcSet
                src
                sizes
                aspectRatio
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
          tags
        }
      }
    }
  }
}
`
