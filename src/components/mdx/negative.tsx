import React, { type ReactNode } from "react"
import { Alert, AlertDescription, Box, Icon } from "@chakra-ui/react"
import { MdMoodBad } from "@react-icons/all-files/md/MdMoodBad"

interface Props {
  children: ReactNode
}

export const NegativeBox: React.FC<Props> = ({ children }) => {
  return (
    <Box p={2}>
      <Alert borderRadius="lg" status="error" flexDirection="column">
        <Icon as={MdMoodBad} boxSize="2em" />
        <AlertDescription pt={1}>{children}</AlertDescription>
      </Alert>
    </Box>
  )
}
