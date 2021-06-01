import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio: React.FunctionComponent = () => {
  const data: GatsbyTypes.BioComponentQuery =
    useStaticQuery<GatsbyTypes.BioComponentQuery>(graphql`
      query BioComponent {
        site {
          siteMetadata {
            author
            social {
              twitter
              github
              instagram
            }
          }
        }
      }
    `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        padding: `8px 8px 8px 8px`,
        margin: `auto`,
        alignItems: `center`
      }}
    >
      <a
        href="https://www.gensobunya.net/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <StaticImage
          src="../../images/profile-icon.png"
          alt={author}
          placeholder="blurred"
          style={{
            maxWidth: "50px",
            margin: `8px 0px 0px 8px`
          }}
          imgStyle={{
            borderRadius: "100%"
          }}
        />
      </a>
      <a
        href={`https://twitter.com/${social.twitter}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StaticImage
          src="../../images/Twitter.png"
          alt="Twitter"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`
          }}
        />
      </a>
      <a
        href={`https://github.com/${social.github}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StaticImage
          src="../../images/Github.png"
          alt="Github"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`
          }}
        />
      </a>
      <a
        href={`https://www.instagram.com/${social.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StaticImage
          src="../../images/Instagram.png"
          alt="instagram"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`
          }}
        />
      </a>
    </div>
  )
}

export default Bio
