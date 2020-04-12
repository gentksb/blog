import React from "react"
import { Link } from "gatsby"
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import { Grid, Button } from '@material-ui/core'

const PrevAndNextPost = ({ previous, next }) => {
  return (
    <Grid container style={{ marginTop: `8px` }} spacing={2}>
      <Grid item xs={6}>
        {previous && (
          <Link to={previous.fields.slug} rel="prev" style={{ textDecoration: 'none' }}>
            <Button fullWidth startIcon={<ArrowBackIos />} variant="outlined">
              {previous.frontmatter.title}
            </Button>
          </Link>
        )}
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        {next && (
          <Link to={next.fields.slug} rel="next" style={{ textDecoration: 'none' }}>
            <Button fullWidth endIcon={<ArrowForwardIos />} variant="outlined">
              {next.frontmatter.title}
            </Button>
          </Link>
        )}
      </Grid>
    </Grid>
  )
}

export default PrevAndNextPost