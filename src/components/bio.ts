import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioComponent {
      avatar: file(absolutePath: { regex: "/profile-icon.png/" }) {
        childImageSharp {
          fluid(maxWidth: 50) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      githubIcon: file(absolutePath: { regex: "/Github.png/" }) {
        childImageSharp {
          fluid(maxWidth: 50) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      instaIcon: file(absolutePath: { regex: "/Instagram.png/" }) {
        childImageSharp {
          fluid(maxWidth: 50) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      twitterIcon: file(absolutePath: { regex: "/Twitter.png/" }) {
        childImageSharp {
          fluid(maxWidth: 50) {
            ...GatsbyImageSharpFluid
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
        margin: `auto`,
        alignItems: `center`,
      }}
    >
      <a
        href="https://www.gensobunya.net/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          fluid={data.avatar.childImageSharp.fluid}
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
      <a
        href={`https://twitter.com/${social.twitter}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          fluid={data.twitterIcon.childImageSharp.fluid}
          alt="Twitter"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`,
          }}
        />
      </a>
      <a
        href={`https://github.com/${social.github}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          fluid={data.githubIcon.childImageSharp.fluid}
          alt="Github"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`,
          }}
        />
      </a>
      <a
        href={`https://www.instagram.com/${social.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          fluid={data.instaIcon.childImageSharp.fluid}
          alt="Instagram"
          style={{
            width: `25px`,
            margin: `0px 0px 0px 8px`,
            display: `inline-block`,
          }}
        />
      </a>
    </div>
  )
}

export default Bio
