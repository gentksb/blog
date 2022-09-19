import { Text } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export const MdxParagraph: React.FC<Props> = ({ children }) => {
  return (
    <Text
      lineHeight={1.8}
      fontSize={{ base: "15px", md: "17px" }}
      paddingBottom={8}
    >
      {children}
    </Text>
  )
}
