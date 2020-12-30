import { Text } from "@chakra-ui/react"
import { Link } from "gatsby"

interface Props {
  title: string
}

  const blogTitleText: React.FunctionComponent<Props> = ({title}) => (
      <Text fontSize="6xl" color="gray.50" decoration="none" align="center">
        <Link to={`/`}>{title}</Link>
      </Text>
  )

  export default blogTitleText