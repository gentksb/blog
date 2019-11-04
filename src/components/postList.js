import React from "react"
import { Link } from "gatsby"
// import Img from "gatsby-image"
import { Typography, Container, Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea, Button } from '@material-ui/core'
import styled from "@emotion/styled";
import PostTag from "./postTag"

const PostContainer = styled(Container)`
`
const PostHeader = styled(CardHeader)`
`
const Postcard = styled(Card)`
  margin:20px;
`
const PostExcerpt = styled(Typography)`
`
const ReadmoreButton = styled(Button)`
`

const postList = ({ props }) => {
  const postCards = (
    props.map(({ node }) => (
      <Postcard key={node.id}>
        <CardActionArea>
          <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
            <PostHeader title={node.frontmatter.title} subheader={node.frontmatter.date} />
          </Link>
        </CardActionArea>
        <PostTag tags={node.frontmatter.tags} />
        <CardMedia image={node.frontmatter.cover != null ? (node.frontmatter.cover.childImageSharp.fluid.src) : ("/image/dummy.jpg")} title={`${node.frontmatter.title} cover image`} style={{ paddingTop: '56.25%' }} />
        <CardContent>
          <PostExcerpt component="p">{node.excerpt}</PostExcerpt>
        </CardContent>

        <CardActions>
          <ReadmoreButton color="secondary" href={node.fields.slug}>続きを読む</ReadmoreButton>
        </CardActions>
      </Postcard>
    ))
  )
  return (
    <PostContainer maxWidth="sm">
      {postCards}
    </PostContainer>
  )
}

export default postList