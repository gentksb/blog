import React from "react"
import { WindowLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

interface Props {
  title: string
  image?: string
  location: WindowLocation
  description?: string
  datePublished?: string
}

const SEO: React.FunctionComponent<Props> = (props) => {
  const { description, title, image, location, datePublished } = props
  const { site } = useStaticQuery<Queries.SeoComponentQuery>(
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
  const isTopPage = location.pathname === "/"
  const isPostPage = location.pathname.includes("/post/")
  const currentHost = siteUrl
  // process.env.NODE_ENV === "production" ? siteUrl : location.origin
  // Head APIがpathname以外のlocationを受け取らないため、一旦コメントアウト
  const metaDescription = description ?? site.siteMetadata.description
  const metaImage = currentHost + (image ?? site.siteMetadata.image)
  const canonicalUrl = currentHost + location.pathname
  const metaRobotsContent =
    process.env.NODE_ENV === "production" ? "all" : "none"
  const siteTitle = isTopPage
    ? site.siteMetadata.title
    : `${title} | ${site.siteMetadata.title}`
  const jsonLdType = isPostPage ? "Article" : "Blog"
  const ogType = isPostPage ? "article" : "website"

  const jsonLd: Record<string, unknown> = {
    "@context": "http://schema.org",
    "@type": jsonLdType,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    headline: title,
    image: {
      "@type": "ImageObject",
      url: metaImage
    },
    author: {
      "@type": "Person",
      name: site.siteMetadata.author,
      url: site.siteMetadata.siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "幻想サイクル",
      logo: {
        "@type": "ImageObject",
        url: "https://blog.gensobunya.net/image/logo.jpg"
      }
    },
    url: location.href,
    description: metaDescription,
    datePublished: datePublished
  }

  return (
    <>
      <title>{siteTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="max-image-preview:large" />
      <meta name="robots" content={metaRobotsContent} />
      <meta name="robots" content={metaDescription} />
      <meta property="og:site_name" content={site.siteMetadata.title} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={location.href} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={location.href} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:image" content={metaImage} />
      <meta
        property="twitter:site"
        content={`@${site.siteMetadata.social.twitter}`}
      />
      <meta property="twitter:domain" content="blog.gensobunya.net" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  )
}

export default SEO
