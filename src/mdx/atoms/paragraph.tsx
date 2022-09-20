import { Heading, Text } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const baseColor = "blue.500"

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

export const MdxH2: React.FC<Props> = ({ children }) => {
  return (
    <Heading
      as="h2"
      marginY={4}
      padding={4}
      backgroundColor={baseColor}
      color="#f6f6f6"
      fontWeight="bold"
      fontSize="xl"
    >
      {children}
    </Heading>
  )
}

export const MdxH3: React.FC<Props> = ({ children }) => {
  return (
    <Heading
      as="h3"
      marginY={4}
      padding={2}
      borderLeftWidth={4}
      borderLeftColor={baseColor}
      borderBottomRadius="lg"
      borderBottomWidth={1}
      borderBottomColor={baseColor}
      fontSize="lg"
    >
      {children}
    </Heading>
  )
}

export const MdxH4: React.FC<Props> = ({ children }) => {
  return (
    <Heading as="h4" fontSize="lg" fontWeight="bold">
      {children}
    </Heading>
  )
}
