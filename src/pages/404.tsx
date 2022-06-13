import React from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/utils/seo"

const NotFoundPage: React.FunctionComponent<
  PageProps<Queries.NotFoundPageQuery, Queries.SitePage["pageContext"]>
> = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" location={location} />
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query NotFoundPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`
