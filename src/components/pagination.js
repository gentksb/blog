import { Link } from "gatsby"
import React from "react"
import { Card, Grid, CardActionArea, CardContent, Container } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import styled from "@emotion/styled";

const Pagination = ({ props }) => {
  const { pageContext } = props
  const { previousPagePath, nextPagePath } = pageContext
  const PrevNextContainer = styled(Container)`
    margin-top:16px;
  `

  return (
    <PrevNextContainer>
      <Grid container spacing={3} justify="center">
        <Grid item xs={6}>
          <Card style={{ height: "100%" }}>
            <CardActionArea style={{ height: "100%" }}>
              {nextPagePath ?
                <Link to={nextPagePath}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={2}><ArrowBackIos /></Grid>
                      <Grid item xs={10}>Older</Grid>
                    </Grid>
                  </CardContent>
                </Link>
                : null}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right" }}>
          <Card style={{ height: "100%" }}>
            <CardActionArea style={{ height: "100%" }}>
              {previousPagePath ?
                <Link to={previousPagePath}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={10}>Newer</Grid>
                      <Grid item xs={2}><ArrowForwardIos /></Grid>
                    </Grid>
                  </CardContent>
                </Link>
                : null}
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </PrevNextContainer>
  )
}

export default Pagination
