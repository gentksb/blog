import React from "react"
import { WindowLocation } from "@reach/router"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface LocationState {
  title: string
  image?: string
  location: WindowLocation
}

interface MetaObject {
  name: string
  content: any
  property?: undefined
}

interface SeoDefaultProps {
  lang?: string
  meta?: MetaObject[]
  description?: string
}

interface Props extends LocationState, SeoDefaultProps {}

const SEO: React.FunctionComponent<Props> = (props) => {
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

  const siteUrl = site.siteMetadata.siteUrl
  const currentHost =
    process.env.NODE_ENV === "production" ? siteUrl : location.origin
  const metaDescription = description ?? site.siteMetadata.description
  const metaImage = currentHost + (image ?? site.siteMetadata.image)
  const canonicalUrl = currentHost + location.pathname
  const metaRobotsContent =
    process.env.NODE_ENV === "production" ? "all" : "none"
  const siteTitle =
    location.pathname === "/"
      ? site.siteMetadata.title
      : `%s | ${site.siteMetadata.title}`
  const jsonLdType = location.pathname.includes("/post/") ? "Article" : "Blog"
  const ogType = location.pathname.includes("/post/") ? "article" : "website"

  const jsonLd: Object = {
    "@context": "http://schema.org",
    "@type": jsonLdType,
    name: title,
    image: {
      "@type": "ImageObject",
      url: metaImage
    },
    author: {
      "@type": "Person",
      name: site.siteMetadata.author,
      url: site.siteMetadata.siteUrl
    },
    url: location.href,
    description: metaDescription
  }

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={siteTitle}
      link={[{ rel: "canonical", href: canonicalUrl }]}
      meta={[
        {
          name: `robots`,
          content: `max-image-preview:large`
        },
        {
          name: "robots",
          content: metaRobotsContent
        },
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:site_name`,
          content: site.siteMetadata.title
        },
        {
          property: `og:type`,
          content: ogType
        },
        {
          property: `og:url`,
          content: location.href
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:image`,
          content: metaImage
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`
        },
        {
          property: `twitter:url`,
          content: location.href
        },

        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          property: `twitter:image`,
          content: metaImage
        },
        {
          name: `twitter:site`,
          content: `@${site.siteMetadata.social.twitter}`
        },
        {
          name: `twitter:domain`,
          content: location.host
        }
      ].concat(meta)}
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  description: ``
}

export default SEO
