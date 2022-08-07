import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Text } from "@chakra-ui/react"

const topMessage: React.FunctionComponent = () => {
  const data: Queries.topMessageQuery =
    useStaticQuery<Queries.topMessageQuery>(graphql`
      query topMessage {
        site {
          siteMetadata {
            topMessage
          }
        }
      }
    `)

  const { topMessage } = data.site.siteMetadata
  const message =
    topMessage.length === 0 ? (
      <></>
    ) : (
      <Text color="gray.50" align="center" fontSize={{ base: "xs", md: "sm" }}>
        <div dangerouslySetInnerHTML={{ __html: topMessage }} />
      </Text>
    )

  return message
}

export default topMessage
