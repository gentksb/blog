import { Link } from "gatsby"
import React from "react"
import { Grid, Button, GridItem } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { SitePageContext } from '../../../types/graphql-types'

interface Props {
  props : SitePageContext
}

const Pagination: React.FunctionComponent<Props> = ({ props }) => {
  const { previousPagePath, nextPagePath } = props
  const hasPreviousPage : boolean = (!previousPagePath)
  const hasNextPage : boolean = (!nextPagePath)

  return (
    <Grid templateColumns="repeat(2,1fr)" w="100%">
      <GridItem colspan={1}>
          <Link to={nextPagePath}>
            <Button variant="outline" colorScheme="teal" isDisabled={hasNextPage}>
              <ArrowBackIcon />Older Posts
            </Button>
          </Link>
      </GridItem>
      <GridItem colspan={1} textAlign="right">
          <Link to={previousPagePath}>
            <Button variant="outline" colorScheme="teal" isDisabled={hasPreviousPage}>
              Newer Posts<ArrowForwardIcon />
            </Button>
          </Link>
      </GridItem>
    </Grid>
  )
}

export default Pagination
