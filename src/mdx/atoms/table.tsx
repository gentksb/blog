import React, { ReactNode } from "react"
import { Table, TableContainer } from "@chakra-ui/react"

interface Props {
  children: ReactNode
}

export const MdxTable: React.FC<Props> = ({ children }) => {
  return (
    <TableContainer paddingBottom={2}>
      <Table variant="simple">{children}</Table>
    </TableContainer>
  )
}
