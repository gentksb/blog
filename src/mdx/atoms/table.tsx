import React, { ReactNode } from "react"
import { Table } from "@chakra-ui/react"

interface Props {
  children: ReactNode
}

export const MdxTable: React.FC<Props> = ({ children }) => {
  return <Table variant="simple">{children}</Table>
}
