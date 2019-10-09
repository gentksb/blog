import React from "react"
import { graphql } from "gatsby"


import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PostCardList from "../components/postcardlist"

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
              <h3>{node.frontmatter.title}</h3>
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
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, limit: 5) {
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
          }
          tags
        }
      }
    }
  }
}

`
