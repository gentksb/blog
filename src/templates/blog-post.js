import React from "react"
import { Link, graphql } from "gatsby"
import { Typography, Container, Card, CardHeader, CardContent, Grid, Divider, CardActionArea } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'

// import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Share from "../components/share"
import PostTag from "../components/postTag"
class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const seoImage = post.frontmatter.cover != null ? (post.frontmatter.cover.childImageSharp.fluid.src) : ("/image/dummy.jpg")

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} image={seoImage} />
        <Container>
          <Card>
            <article>
              <CardHeader component="header" title={post.frontmatter.title} subheader={post.frontmatter.date} />
              <PostTag tags={post.frontmatter.tags} />
              <CardContent>
                <Typography variant="body1" component="section" dangerouslySetInnerHTML={{ __html: post.html }} />
              </CardContent>
            </article>
            <Divider variant="middle" />
            <Share post={post} location={this.props.location} />
            {/* <Bio /> */}
          </Card>

          {/* start Pext-Post & Prev-Post */}

          <Grid container style={{ marginTop: `5px` }} spacing={1}>
            <Grid item xs>
              <Card style={{ height: "100%" }}>
                <CardActionArea style={{ height: "100%" }}>
                  {previous && (
                    <Link to={previous.fields.slug} rel="prev" style={{ textDecoration: 'none' }}>
                      <CardContent>
                        <Grid container>
                          <Grid item xs={2}><ArrowBackIos /></Grid>
                          <Grid item xs={10}>{previous.frontmatter.title}</Grid>
                        </Grid>
                      </CardContent>
                    </Link>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs style={{ textAlign: "right" }}>
              <Card style={{ height: "100%" }}>
                <CardActionArea style={{ height: "100%" }}>
                  {next && (
                    <Link to={next.fields.slug} rel="next" style={{ textDecoration: 'none' }}>
                      <CardContent>
                        <Grid container>
                          <Grid item xs={10}>{next.frontmatter.title}</Grid>
                          <Grid item xs={2}><ArrowForwardIos /></Grid>
                        </Grid>
                      </CardContent>
                    </Link>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          {/* end Pext-Post & Prev-Post */}

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
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
