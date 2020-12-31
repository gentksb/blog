import React from "react"
import { Link } from "gatsby"
import { Grid, Button, GridItem } from "@chakra-ui/react"
import { SitePageContextNext, SitePageContextPrevious } from '../../../types/graphql-types'
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"

interface Props {
  previous?: SitePageContextPrevious
  next?: SitePageContextNext
}

const PrevAndNextPost: React.FunctionComponent<Props> = ({ previous, next }) => {
  const hasPreviousPost : boolean = (!!previous)
  const hasNextPost : boolean = (!!next)

  return (
    <Grid templateColumns="repeat(2,1fr)" gap={2}>
      <GridItem colSpan={1}>
          <Link to={previous.fields.slug} rel="prev">
            <Button variant="outline" isDisabled={!hasPreviousPost}>
              <ArrowBackIcon />{previous.frontmatter.title}
            </Button>
          </Link>
      </GridItem>
      <GridItem colSpan={1} textAlign="right">
          <Link to={next.fields.slug} rel="next">
            <Button variant="outline" isDisabled={!hasNextPost}>
              {next.frontmatter.title}<ArrowForwardIcon />
            </Button>
          </Link>
      </GridItem>
    </Grid>
  )
}

export default PrevAndNextPost