import path from "path"
import { createFilePath } from "gatsby-source-filesystem"
import { paginate } from "gatsby-awesome-pagination"
import { GatsbyNode } from "gatsby"

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions
}) => {
  const { createPage } = actions

  const postsQueryResult = await graphql<Queries.AllPostNodeQuery>(`
    query AllPostNode {
      allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { draft: { ne: true } } }
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
          next {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
          previous {
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
  `)

  const tagsQueryResult = await graphql<Queries.AllTagNodeQuery>(`
    query AllTagNode {
      allMdx {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `)

  if (postsQueryResult.errors || tagsQueryResult.errors) {
    throw postsQueryResult.errors
  }

  const posts = postsQueryResult.data.allMdx.edges

  // Create blog posts pages.
  posts.forEach((post) => {
    createPage({
      path: post.node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      context: {
        slug: post.node.fields.slug,
        previous: post.previous,
        next: post.next
      }
    })
  })

  // Create Tag Page
  // Extract tag data from query
  const tags = tagsQueryResult.data.allMdx.group
  // Make tag pages
  tags.forEach((tag) => {
    createPage({
      path: `/tags/${tag.fieldValue.toLowerCase()}/`,
      component: path.resolve("./src/templates/tags.tsx"),
      context: {
        tag: tag.fieldValue
      }
    })
  })

  //Create pagination
  const buildPagination = (posts) => {
    paginate({
      createPage, // The Gatsby `createPage` function
      items: posts, // An array of objects
      itemsPerPage: 7,
      itemsPerFirstPage: 7, // How many items you want per page
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? "/" : "/page"), // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve("./src/templates/index.tsx") // Just like `createPage()`
    })
  }
  buildPagination(posts)
}

export interface PaginationContext {
  pageNumber: Number
  humanPageNumber: Number
  skip: Number
  limit: Number
  numberOfPages: Number
  previousPagePath: string
  nextPagePath: string
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode
}) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}

// firebase v9がnode.jsで利用できないパッケージを参照する対策
// https://github.com/gatsbyjs/gatsby/issues/29012

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  stage,
  loaders,
  actions
}) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /firebase/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}
