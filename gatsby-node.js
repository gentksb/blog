const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { paginate } = require("gatsby-awesome-pagination")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const postsQueryResult = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: {frontmatter: {draft: {ne: true}}}
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  const tagsQueryResult = await graphql(`
  {
    allMarkdownRemark {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
  }
  `)

  if (postsQueryResult.errors) {
    throw postsQueryResult.errors
  }

  const posts = postsQueryResult.data.allMarkdownRemark.edges

  // Create blog posts pages.
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
  // Create Tag Page
  // Extract tag data from query
  const tags = tagsQueryResult.data.allMarkdownRemark.group
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag.fieldValue.toLowerCase()}/`,
      component: path.resolve("./src/templates/tags.js"),
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  //Create pagination
  const buildPagination = posts => {
    paginate({
      createPage, // The Gatsby `createPage` function
      items: posts, // An array of objects
      itemsPerPage: 10,
      itemsPerFirstPage: 6, // How many items you want per page
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? "/" : "/page"), // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve("./src/templates/index.js"), // Just like `createPage()`
    })
  }
  buildPagination(posts)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
