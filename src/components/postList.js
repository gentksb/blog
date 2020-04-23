import React from "react"
import { Link } from "gatsby"
// import Img from "gatsby-image"
import { Typography, Grid, Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea, Button } from '@material-ui/core'
import styled from "@emotion/styled";
import PostTag from "./postTag"

const PostGrid = styled(Grid)`

`
const PostHeader = styled(CardHeader)`
`
const Postcard = styled(Card)`
  margin-top: 16px;
`
const PostExcerpt = styled(Typography)`
`
const ReadmoreButton = styled(CardActions)`
  justify-content:flex-end;
`

const postList = ({ props }) => {
  const postCards = (
    props.map(({ node }) => (
      <Grid item xs={12} md={6} key={node.id}>
        <Postcard>
          <CardActionArea aria-label={node.frontmatter.title}>
            <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
              <PostHeader title={node.frontmatter.title} subheader={node.frontmatter.date} component="h2" />
            </Link>
          </CardActionArea>
          <PostTag tags={node.frontmatter.tags} />
          <CardMedia image={node.frontmatter.cover != null ? (node.frontmatter.cover.childImageSharp.fluid.src) : ("/image/dummy.jpg")} title={`${node.frontmatter.title} cover image`} style={{ paddingTop: '56.25%' }} />
          <CardContent>
            <PostExcerpt component="p">{node.excerpt}</PostExcerpt>
          </CardContent>

          <ReadmoreButton>
            <Button variant="contained" color="secondary" href={node.fields.slug} disableElevation >この記事を読む</Button>
          </ReadmoreButton>
        </Postcard>
      </Grid>
    ))
  )
  return (
    <PostGrid container spacing={2}>
      {postCards}
    </PostGrid>
  )
}

export default postList
