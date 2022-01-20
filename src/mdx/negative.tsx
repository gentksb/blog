import React from "react"
import { Alert, AlertDescription, Box, Icon } from "@chakra-ui/react"
import { MdMoodBad } from "@react-icons/all-files/md/MdMoodBad"

export const NegativeBox: React.FC = ({ children }) => {
  return (
    <Box p={2}>
      <Alert borderRadius="lg" status="error" flexDirection="column">
        <Icon as={MdMoodBad} boxSize="2em" />
        <AlertDescription pt={1}>{children}</AlertDescription>
      </Alert>
    </Box>
  )
}
