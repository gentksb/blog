import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  graphqlTypegen: true,
  siteMetadata: {
    title: `幻想サイクル`,
    author: `Gen`,
    description: `AJOCC C1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです`,
    siteUrl: `https://blog.gensobunya.net`,
    image: `/image/logo.jpg`,
    social: {
      twitter: `gen_sobunya`,
      github: `gentksb`,
      instagram: `gen_sobunya`
    },
    topMessage: ""
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-emotion`,
    `@chakra-ui/gatsby-plugin`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-sharp`,
    //   options: {
    //     defaults: {
    //       transformOptions: {
    //         fit: "inside",
    //         cropFocus: "attention"
    //       }
    //     }
    //   }
    // },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        plugins: [`gatsby-remark-images`],
        // a workaround to solve mdx-remark plugin compat issue
        // https://github.com/gatsbyjs/gatsby/issues/15486
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              srcSetBreakpoints: [810, 1080, 1200],
              maxWidth: 1200, //discover用
              quality: 80,
              withWebp: true,
              wrapperStyle: `max-height: 800px`,
              showCaptions: true
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem;`
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false
            }
          },
          `gatsby-remark-copy-linked-files`
        ]
      }
    },
    {
      resolve: "gatsby-plugin-preconnect",
      options: {
        domains: [
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com"
        ]
      }
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-S8PKGWKFS2"]
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-MGHR8XJ`,
        includeInDevelopment: true,
        enableWebVitalsTracking: true
      }
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  categories: edge.node.frontmatter.tags,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                })
              })
            },
            query: `
              query RssFeed {
                allMdx(sort: {order: DESC, fields: [frontmatter___date]}, limit: 20, filter: {frontmatter: {draft: {ne: true}}}) {
                  edges {
                    node {
                      excerpt
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: `/index.xml`,
            title: `幻想サイクル`,
            match: `^/blog/`
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `幻想サイクル`,
        short_name: `幻想サイクル`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/image/logo.jpg`
      }
    },
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        allPageHeaders: [
          "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
        ]
      }
    }
  ]
}

export default config
