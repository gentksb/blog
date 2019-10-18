import React from "react"
import { Link } from "gatsby"
// import Img from "gatsby-image"
import { Typography, Container, Card, CardHeader, CardMedia, CardContent, CardActions, Button } from '@material-ui/core'
import styled from "@emotion/styled";
import PostTag from "./postTag"

const PostContainer = styled(Container)`
`
const Postcard = styled(Card)`
  width: 50vw;
`
const PostExcerpt = styled(Typography)`
`
const ReadmoreButton = styled(Button)`
`

const postList = ({ props }) => {
  return (
    props.map(({ node }) => (
      <PostContainer key={node.id}>
        <Postcard>
          <Link to={node.fields.slug}>
            {node.frontmatter.cover != null ? (
              <CardMedia image={node.frontmatter.cover.childImageSharp.fluid.src} title={`${node.frontmatter.title} cover image`} style={{ paddingTop: '56.25%' }} />
            ) : (
                <img src="/image/dummy.jpg" alt="no cover" />
              )}
            <CardHeader title={node.frontmatter.title} subheader={node.frontmatter.date} />
          </Link>
          <CardContent>
            <PostExcerpt component="p">{node.excerpt}</PostExcerpt>
          </CardContent>
          <CardActions>
            <ReadmoreButton variant="contained" color="primary" href={node.fields.slug}>続きを読む</ReadmoreButton>
          </CardActions>
          {node.frontmatter.tags != null ? (
            <PostTag tags={node.frontmatter.tags} />
          ) : (
              "No Tags"
            )}
        </Postcard>
      </PostContainer>
    ))
  )
}

export default postList