import React from "react"
import { Link } from "gatsby"
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import { Card, CardContent, Grid, CardActionArea } from '@material-ui/core'

const PrevAndNextPost = ({ previous, next }) => {
  return (
    <Grid container style={{ marginTop: `8px` }} spacing={2}>
      <Grid item xs={6}>
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
      <Grid item xs={6} style={{ textAlign: "right" }}>
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
  )
}

export default PrevAndNextPost