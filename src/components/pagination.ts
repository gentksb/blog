import { Link } from "gatsby"
import React from "react"
import { Grid, Button } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import styled from "@emotion/styled";

const Pagination = ({ props }) => {
  const { pageContext } = props
  const { previousPagePath, nextPagePath } = pageContext

  const PaginationLink = styled(Link)`
  text-decoration:none;
  `

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={6} style={{ textAlign: "left" }}>
        {nextPagePath ?
          <PaginationLink to={nextPagePath}>
            <Button variant="outlined" color="primary" startIcon={<ArrowBack />}>
              Older Posts
            </Button>
          </PaginationLink>
          : <Button variant="outlined" disabled startIcon={<ArrowBack />}>
            Older Posts
            </Button>}
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        {previousPagePath ?
          <PaginationLink to={previousPagePath}>
            <Button variant="outlined" color="primary" endIcon={<ArrowForward />}>
              Newer Posts
            </Button>
          </PaginationLink>
          : <Button variant="outlined" disabled endIcon={<ArrowForward />}>
            Newer Posts
            </Button>}
      </Grid>
    </Grid>
  )
}

export default Pagination
