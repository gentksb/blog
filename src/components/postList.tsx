import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import { Typography, Grid, Paper, CardHeader, CardMedia, CardContent, CardActions, CardActionArea, Button, Divider, Hidden } from '@material-ui/core'
import styled from "@emotion/styled";
import PostTag from "./postTag"
import { IndexPageQuery } from '../../types/graphql-types'

const Postcard = styled(Paper)`
  margin-top: 16px;
`
const ReadmoreButton = styled(CardActions)`
  justify-content:flex-end;
`

interface Props {
  props : IndexPageQuery['allMarkdownRemark']['edges']
}


const postList: React.FunctionComponent<Props> = ({ props }) => {

  const postCards = (
    props.map(({ node }) => {

      const coverTitleText = `${node.frontmatter.title} cover image`
      const postCoverBox = node.frontmatter.cover != null ? (<Img fluid={{ ...node.frontmatter.cover.childImageSharp.fluid, aspectRatio: 16 / 9 }} title={coverTitleText} />) : (<CardMedia image="/image/dummy.jpg" title={coverTitleText} style={{ paddingTop: '56.25%' }} />)

      return (
        <Grid item xs={12} md={6} key={node.id}>
          <Postcard elevation={0} variant="outlined">
            <CardActionArea aria-label={node.frontmatter.title}>
              <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
                <CardHeader title={node.frontmatter.title} subheader={node.frontmatter.date} component="h2" />
              </Link>
            </CardActionArea>
            <Divider variant="middle" />
            <PostTag tags={node.frontmatter.tags} />
              <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
                {postCoverBox}
              </Link>
            <Hidden smDown>
              <CardContent>
                <Typography component="p">{node.excerpt}</Typography>
              </CardContent>
              <ReadmoreButton>
                <Button variant="contained" color="secondary" href={node.fields.slug} disableElevation >この記事を読む</Button>
              </ReadmoreButton>
             </Hidden>
          </Postcard>
        </Grid>
      )
    })
  )
  return (
    <Grid container spacing={2}>
      {postCards}
    </Grid>
  )
}

export default postList
