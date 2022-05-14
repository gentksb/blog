import { Link } from "gatsby"
import React from "react"
import { Grid, Button, GridItem } from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import { PaginationContext } from "../../../gatsby-node"

interface Props {
  paginationdata: PaginationContext
}

const Pagination: React.FunctionComponent<Props> = (props) => {
  const { previousPagePath, nextPagePath } = props.paginationdata
  const hasNewerPage = !!previousPagePath
  const hasOlderPage = !!nextPagePath

  return (
    <Grid templateColumns="repeat(2,1fr)" w="100%">
      <GridItem colSpan={1}>
        {hasOlderPage ? (
          <Link to={nextPagePath}>
            <Button
              variant="outline"
              colorScheme="teal"
              isDisabled={!hasOlderPage}
            >
              <ArrowBackIcon />
              Older Posts
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            colorScheme="teal"
            isDisabled={!hasOlderPage}
          >
            <ArrowBackIcon />
            Older Posts
          </Button>
        )}
      </GridItem>
      <GridItem colSpan={1} textAlign="right">
        {hasNewerPage ? (
          <Link to={previousPagePath}>
            <Button
              variant="outline"
              colorScheme="teal"
              isDisabled={!hasNewerPage}
            >
              Newer Posts
              <ArrowForwardIcon />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            colorScheme="teal"
            isDisabled={!hasNewerPage}
          >
            Newer Posts
            <ArrowForwardIcon />
          </Button>
        )}
      </GridItem>
    </Grid>
  )
}

export default Pagination
