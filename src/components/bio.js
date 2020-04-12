/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-icon.png/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
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
        margin: `auto`
      }}
    >
      <a href="https://www.gensobunya.net/" target="_blank" rel="noopener noreferrer">
        <Image
          fixed={data.avatar.childImageSharp.fixed}
          alt={author}
          style={{
            marginBottom: 0,
            minWidth: 50,
            borderRadius: `100%`,
          }}
          imgStyle={{
            borderRadius: `50%`,
          }}
        />
      </a>
      <p>
        {` `}
        <a href={`https://twitter.com/${social.twitter}`} target="_blank" rel="noopener noreferrer">
          <img
            src="/social_icons/Twitter.png"
            alt="Twitter logo"
            width="25"
            style={{
              margin: `0px 0px 0px 8px`
            }}
          />
        </a>
        <a href={`https://github.com/${social.github}`} target="_blank" rel="noopener noreferrer">
          <img
            src="/social_icons/Github.png"
            alt="Github logo"
            width="25"
            style={{
              margin: `0px 0px 0px 8px`
            }}
          />
        </a>
        <a href={`https://www.instagram.com/${social.instagram}`} target="_blank" rel="noopener noreferrer">
          <img
            src="/social_icons/instagram.png"
            alt="instagram logo"
            width="25"
            style={{
              margin: `0px 0px 0px 8px`
            }}
          />
        </a>
      </p>
    </div>
  )
}

export default Bio
