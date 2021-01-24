import { css } from '@emotion/react'

const BlogPostStyle = css`

    /* mobile横スクロール許可テーブル */
    .scrollable_table div {
      overflow-x:auto;
    }
    .scrollable_table table {
      width: auto;
      border: 1px solid #555555;
      border-collapse: collapse;
      border-spacing: 0;
    }
    .scrollable_table th {
      color: #fff;
      padding: 5px;
      border-bottom: 1px solid #555555;
      border-left: 1px solid #555555;
      background: gray;
      line-height: 120%;
      text-align: center;
    }
    .scrollable_table td {
      padding: 5px;
      border-bottom: 1px solid #555555;
      border-left: 1px solid #555555;
    }
  `

export default BlogPostStyle