/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"

import { rhythm } from "../utils/typography"

const SocialLogo = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 5px;
`
const ImageLink = styled.a`
  box-shadow: none;
`

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
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p>
        Written by <strong>{author}</strong>
        {` `}
        <ImageLink href={`https://twitter.com/${social.twitter}`}>
          <SocialLogo
            src="/social_icons/Twitter.png"
            alt="Twitter logo"
            width="25"
          />
        </ImageLink>
        <ImageLink href={`https://github.com/${social.github}`}>
          <SocialLogo
            src="/social_icons/Github.png"
            alt="Github logo"
            width="25"
          />
        </ImageLink>
        <ImageLink href={`https://www.instagram.com/${social.instagram}`}>
          <SocialLogo
            src="/social_icons/instagram.png"
            alt="instagram logo"
            width="25"
          />
        </ImageLink>
      </p>
    </div>
  )
}

export default Bio
