module.exports = {
  flags: {
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PRESERVE_WEBPACK_CACHE: true
  },
  siteMetadata: {
    title: `幻想サイクル`,
    author: `Gen`,
    description: `gensobunya's bicycle life`,
    siteUrl: `https://blog.gensobunya.net`,
    image: `/image/logo.jpg`,
    social: {
      twitter: `gen_sobunya`,
      github: `gentksb`,
      instagram: `gen_sobunya`,
    },
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `@chakra-ui/gatsby-plugin`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `src/__generated__/gatsby-types.d.ts`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200, //discover用
              wrapperStyle: `margin-bottom: 16px;`,
              quality: 80,
              withWebp: true,
              loading: `lazy`,
              maxHeight: 760,
              fit: `inside`
            },
          },
          `gatsby-remark-embedder`,
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem;`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                scrollableTable: {
                  classes: "scrollable_table",
                },
              },
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
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
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: `GTM-MGHR8XJ`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: ["/tags/*", "/page/*"],
      }
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          fucntions: true
        },
        credentials: {
          apiKey: process.env.FIREBASE_API_KEY,
          projectId: process.env.FIREBASE_PROJECT_ID,
          appId: process.env.FIREBASE_APP_ID
        }
      }
    },
    {
      resolve: `gatsby-plugin-feed-mdx`,
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
              return allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  categories: edge.node.frontmatter.tags,
                  custom_elements: [{ "content:encoded": edge.node.html }],
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
            match: `^/blog/`,
          },
        ],
      },
    },
  ],
}
