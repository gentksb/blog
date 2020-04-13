module.exports = {
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              maxHeight: 450,
              fit: `contain`,
              background: `white`,
              linkImagesToOriginal: true,
              loading: `lazy`,
              disableBgImage: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
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
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `tomato`,
        showSpinner: false,
      },
    },
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-emotion`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-preconnect",
      options: {
        domains: [
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://stats.g.doubleclick.net",
          "https://aml.valuecommerce.com",
          "https://ag.innovid.com",
          "https://e.dlx.addthis.com",
          "https://csi.gstatic.com",
          "https://pixel.everesttech.net",
          "https://fcmatch.youtube.com",
          "https://fcmatch.google.com",
          "https://odr.mookie1.com",
          "https://rtb.openx.net",
          "https://ssum-sec.casalemedia.com",
          "https://pixel.rubiconproject.com",
          "https://cms.quantserve.com",
          "https://dalc.valuecommerce.com",
          "https://dalb.valuecommerce.com",
          "https://d.agkn.com",
          "https://fonts.googleapis.com",
          "https://lh3.googleusercontent.com",
          "https://us-u.openx.net",
          "https://www.gstatic.com",
          "https://id.rlcdn.com",
          "https://www.google.com",
          "https://tpc.googlesyndication.com",
          "https://a.imgvc.com",
          "https://pagead2.googlesyndication.com",
          "https://googleads.g.doubleclick.net",
          "https://partner.googleadservices.com",
          "https://cm.g.doubleclick.net",
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
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
              {
                allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 20) {
                  edges {
                    node {
                      excerpt
                      html
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
