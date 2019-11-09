/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title, image, location }) {
  const { site } = useStaticQuery(
    graphql`
      query SeoQuery{
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
  const metaImage = site.siteMetadata.siteUrl + (image || site.siteMetadata.image)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={location.pathname === "/" ? site.siteMetadata.title : `%s | ${site.siteMetadata.title}`}
      meta={[
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
          content: location.href
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
        }
      ].concat(meta)}
    >
      {/* <script data-ad-client="ca-pub-0056151430743709" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
