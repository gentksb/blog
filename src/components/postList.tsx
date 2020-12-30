import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import { Typography, Paper, CardHeader, CardMedia, CardContent, CardActions, CardActionArea, Button, Divider, Hidden } from '@material-ui/core'
import styled from "@emotion/styled";
import { Grid, GridItem } from "@chakra-ui/react";

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
    props.map(({ node }, index) => {

      const coverTitleText = `${node.frontmatter.title} cover image`
      const postCoverBox = node.frontmatter.cover != null ? (<Img fluid={{ ...node.frontmatter.cover.childImageSharp.fluid, aspectRatio: 16 / 9 }} title={coverTitleText} />) : (<CardMedia image="/image/dummy.jpg" title={coverTitleText} style={{ paddingTop: '56.25%' }} />)
      const columnSpan = index === 0 ? 2 : 1

      return (
        <GridItem colSpan={columnSpan} key={node.id}>
          <Postcard elevation={0} variant="outlined">
            <CardActionArea aria-label={node.frontmatter.title}>
              <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
                <CardHeader title={node.frontmatter.title} subheader={node.frontmatter.date} component="h2" style={{padding : '0 16px'}} />
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
        </GridItem>
      )
    })
  )
  return (
    <Grid templateColumns="repeat(2,1fr)">
      {postCards}
    </Grid>
  )
}

export default postList
