import { Heading } from "@chakra-ui/react"
import { Link } from "gatsby"
import { ElementType } from "react"

interface Props {
  title: string
  markup: ElementType
}

  const blogTitleText: React.FunctionComponent<Props> = ({title, markup}) => (
      <Heading fontSize={{base:"2xl", md:"5xl"}} color="gray.50" decoration="none" align="center" as={markup}>
        <Link to={`/`}>{title}</Link>
      </Heading>
  )

  export default blogTitleText