import { Link } from "gatsby"
import React from "react"
import { Card, Grid, CardActionArea, CardContent, Typography } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import styled from "@emotion/styled";

const Pagination = ({ props }) => {
  const { pageContext } = props
  const { previousPagePath, nextPagePath } = pageContext

  const PaginationLink = styled(Link)`
  text-decoration:none;
  `

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={6}>
        <Card style={{ height: "100%" }}>
          <CardActionArea style={{ height: "100%" }}>
            {nextPagePath ?
              <PaginationLink to={nextPagePath}>
                <CardContent>
                  <Grid container>
                    <Grid item xs={2}><ArrowBackIos /></Grid>
                    <Grid item xs={10}><Typography variant="button">Older</Typography></Grid>
                  </Grid>
                </CardContent>
              </PaginationLink>
              : null}
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={6} style={{ textAlign: "right" }}>
        <Card style={{ height: "100%" }}>
          <CardActionArea style={{ height: "100%" }}>
            {previousPagePath ?
              <PaginationLink to={previousPagePath}>
                <CardContent>
                  <Grid container>
                    <Grid item xs={10}><Typography variant="button">Newer</Typography></Grid>
                    <Grid item xs={2}><ArrowForwardIos /></Grid>
                  </Grid>
                </CardContent>
              </PaginationLink>
              : null}
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Pagination
