import React from "react"
import { WindowLocation } from "@reach/router"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface LocationState {
  title: string
  image?: string
  location: WindowLocation
}

interface MetaObject { name: string; content: any; property?: undefined; }

interface SeoDefaultProps {
  lang?: string
  meta?: MetaObject[]
  description?: string
}

interface Props extends LocationState, SeoDefaultProps {}

const SEO : React.FunctionComponent<Props> = (props) => {
  const { description, lang, meta, title, image, location } = props
  const { site } = useStaticQuery<GatsbyTypes.SeoComponentQuery>(
    graphql`
      query SeoComponent {
        site {
          siteMetadata {
            title
            description
            author
            social {
              twitter
            }
            image
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaImage =
    site.siteMetadata.siteUrl + (image || site.siteMetadata.image)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={
        location.pathname === "/"
          ? site.siteMetadata.title
          : `%s | ${site.siteMetadata.title}`
      }
      meta={[
        {
          name: `robots`,
          content: `max-image-preview:large`
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:site_name`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:url`,
          content: location.href,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:type`,
          content: `blog`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:site`,
          content: `@${site.siteMetadata.social.twitter}`,
        },
      ].concat(meta)}
    >
      <script async src="https://cdn.iframe.ly/embed.js" />
      <script async src="https://platform.twitter.com/widgets.js" />
    </Helmet>
  )
}


SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  description: ``,
}

export default SEO
