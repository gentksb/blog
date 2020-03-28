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
    p {
      margin-bottom: 2em;
      line-height: 1.7;
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

    /* amachazl  https://amachazl.com/migrate/ */
    .amachazl-box {
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
    .amachazl-box a {
      text-decoration: underline;
      box-shadow: none;
    }
    .amachazl-box a:hover {
      box-shadow: none;
    }
    .amachazl-image {
      margin: 0px 14px 1px 0px !important;
    }
    .amachazl-image img {
      margin: 0;
    }
    .amachazl-name a {
      color: #3f89ff;
    }
    .amachazl-name a:hover {
      color: #ffb83f;
    }
    .amachazl-powered-date {
      font-size: 10px !important;
    }
    .amachazl-detail {
      font-size: 12px;
    }
    .amachazl-link {
      margin-top: 10px !important;
    }
    .amachazl-link a {
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
    .amachazl-link a:hover {
      color: #fff !important;
    }

    /***  解像度480px以下のスタイル ***/
    @media screen and (max-width: 480px) {
      .amachazl-sub-info {
        width: 100%;
      }
      .amachazl-link a {
        width: 100%;
      }
    }

    /* アプリーチ */
    .appreach {
      text-align: left;
      padding: 10px;
      border: 1px solid #7C7C7C;
      overflow: hidden;
    }
    .appreach:after {
      content: "";
      display: block;
      clear: both;
    }
    .appreach p {
      margin: 0;
    }
    .appreach a:after {
      display: none;
    }
    .appreach__icon {
      float: left;
      border-radius: 10%;
      overflow: hidden;
      margin: 0 3% 0 0 !important;
      width: 25% !important;
      height: auto !important;
      max-width: 120px !important;
    }
    .appreach__detail {
      display: inline-block;
      font-size: 20px;
      line-height: 1.5;
      width: 72%;
      max-width: 72%;
    }
    .appreach__detail:after {
      content: "";
      display: block;
      clear: both;
    }
    .appreach__name {
      font-size: 16px;
      line-height: 1.5em !important;
      max-height: 3em;
      overflow: hidden;
    }
    .appreach__info {
      font-size: 12px !important;
    }
    .appreach__developper, .appreach__price {
      margin-right: 0.5em;
    }
    .appreach__posted a {
      margin-left: 0.5em;
    }
    .appreach__links {
      float: left;
      height: 40px;
      margin-top: 8px;
      white-space: nowrap;
    }
    .appreach__aslink img {
      margin-right: 10px;
      height: 40px;
      width: 135px;
    }
    .appreach__gplink img {
      height: 40px;
      width: 134.5px;
    }
    .appreach__star {
      position: relative;
      font-size: 14px !important;
      height: 1.5em;
      width: 5em;
    }
    .appreach__star__base {
      position: absolute;
      color: #737373;
    }
    .appreach__star__evaluate {
      position: absolute;
      color: #ffc107;
      overflow: hidden;
      white-space: nowrap;
    }



  `}
  />

export default BlogPostStyle