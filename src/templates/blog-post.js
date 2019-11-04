import React from "react"
import { graphql } from "gatsby"
import { Typography, Container, Card, CardContent, Divider } from '@material-ui/core'

// import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Share from "../components/share"
import PostTag from "../components/postTag"
import PrevAndNextPost from "../components/prevAndNextpost"
import BlogPostStyle from "../styles/blog-post.style"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const seoImage = post.frontmatter.cover != null ? (post.frontmatter.cover.childImageSharp.fluid.src) : ("/image/dummy.jpg")

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} image={seoImage} location={this.props.location} />
        <Container>
          <BlogPostStyle />
          <Card>
            <article>
              <CardContent>
                <header>
                  <Typography component="H1" variant="H1">{post.frontmatter.title}</Typography>
                  <time dateTime={post.frontmatter.date}>
                    <Typography component="div" variant="subtitle1">{post.frontmatter.date}</Typography>
                  </time>
                  <PostTag tags={post.frontmatter.tags} />
                </header>
                <Typography variant="body1" component="section" dangerouslySetInnerHTML={{ __html: post.html }} />
              </CardContent>
            </article>
            <Divider variant="middle" />
            <Share post={post} location={this.props.location} />
            {/* <Bio /> */}
          </Card>

          <nav>
            <PrevAndNextPost previous={previous} next={next} />
          </nav>

        </Container>
      </Layout>
    )
  }
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
    markdownRemark(fields: {slug: {eq: $slug } }) {
          id
      excerpt(truncate: true)
        html
      frontmatter {
          date(formatString: "MMMM DD, YYYY")
        title
        cover {
          base
          childImageSharp {
          fluid {
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
  draft
}
}
}
`
