import React from "react"
import { Global, css } from '@emotion/core'
import theme from '../config/theme'

const BlogPostStyle = () =>
  <Global styles={css`
    h2 {
      padding: 0.25em 0 0.25em 0.75em;
      border-left: 6px solid ${theme.palette.primary.main};
      border-bottom: 1px solid ${theme.palette.primary.main};
    }
    h3 {
      padding: 0.25em 0 0.5em 0.75em;
      border-left: 6px solid ${theme.palette.primary.main};
    }

    /* Quote */
    blockquote {
      position: relative;
      padding: 8px 16px;
      background: #f5f5f5;
      color: #555;
      border-left: 4px solid ${theme.palette.secondary.main};
      width: 90%;
      margin: 16px auto;
    }

    blockquote:before{
        display: inline-block;
        position: absolute;
        top: 16px;
        left: 16px;
        vertical-align: middle;
        /* content: "\f10d";
        font-family: FontAwesome; */
        color: ${theme.palette.secondary.main};
        font-size: 25px;
        line-height: 1;
    }
    
    blockquote p {
        padding: 0;
        margin: 16px 0 8px;
        font-size: 15px;
        line-height: 1.5;
    }

    /* amazlet https://rough-log.com/3528 */
    .amazlet-box {
      color: #3e3e3e;
      background: #fff;
      font-size: 16px;
      line-height: 1.5;
      margin-top: 32px;
      margin-bottom: 32px !important;
      padding: 24px 16px;
      border: 1px solid #eee;
      position: relative;
    }
    .amazlet-box a {
      text-decoration: underline;
      box-shadow: none;
    }
    .amazlet-box a:hover {
      box-shadow: none;
    }
    .amazlet-image {
      margin: 0px 14px 1px 0px !important;
    }
    .amazlet-image img {
      margin: 0;
    }
    .amazlet-name a {
      color: #3f89ff;
    }
    .amazlet-name a:hover {
      color: #ffb83f;
    }
    .amazlet-powered-date {
      font-size: 10px !important;
    }
    .amazlet-detail {
      font-size: 12px;
    }
    .amazlet-link {
      margin-top: 10px !important;
    }
    .amazlet-link a {
      padding: 12px; /* ボタン内側の余白 */
      border-radius: 3px;
      border-bottom: 3px solid #ff9901;
      margin: 10px 0;
      background-color: #ffa01c;
      color: #fff;
      text-decoration: none;
      width: 278px; /* ボタンの幅 */
      display: block;
      text-align: center;
      font-size: 16px;
    }
    .amazlet-link a:hover {
      color: #fff !important;
    }

    /***  解像度480px以下のスタイル ***/
    @media screen and (max-width: 480px) {
      .amazlet-sub-info {
        width: 100%;
      }
      .amazlet-link a {
        width: 100%;
      }
    }
  `}
  />

export default BlogPostStyle