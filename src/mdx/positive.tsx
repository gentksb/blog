import React, { ReactNode } from "react"
import { Alert, AlertDescription, Icon, Box } from "@chakra-ui/react"
import { MdMood } from "@react-icons/all-files/md/MdMood"

interface Props {
  children: ReactNode
}

export const PositiveBox: React.FC<Props> = ({ children }) => {
  return (
    <Box p={2}>
      <Alert borderRadius="lg" status="success" flexDirection="column">
        <Icon as={MdMood} boxSize="2em" />
        <AlertDescription pt={1}>{children}</AlertDescription>
      </Alert>
    </Box>
  )
}
