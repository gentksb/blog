---
title: "WP+GCEからHugo+Netlifyへの移行"
date: 2017-10-11T19:00:21+09:00
draft: false
tags: ["code"]
thumbnail: hugo.png
---
{{<figure src="hugo.png">}}
## 静的サイトジェネレーターへの移行

性能・HTTPS対応などなどについて無料IaaSとWordPressを越えるものを探していたところ、静的サイトジェネレーターという存在を発見。

編集こそ、Markdownの作成で開発者向けではあるものの、HTML直打ちに比べるとテーマの適用やレイアウトのテンプレート化・ページングやタグページの生成などなど、圧倒的なメリットを得られる…

最終的に公開されるものは静的ファイルだけなので当然性能も良いしサーバの性能もそこまで必要ない。有名なツールはいくつかあったが、生成スピードとGolangに興味があったこともあって[Hugo](https://gohugo.io/)を選択。特徴は以下の通り。

+ 超速ビルド（1記事1msec程度）
+ ローカルサーバ機能（hugo serve）コマンド打てばローカルですぐに検証できる
+ ドキュメントが割としっかりしている
+ テーマそこそこいっぱい

## ホスティングはNetlify

静的ファイル配信にIaaS使うのはあまりにもアホらしいのでホスティングを探す。\
定番はS3やCloudStrageの静的WEBサイト配信機能を使うことだが、CDNが有料だったりリダイレクトを維持できなかったりと少し課題あり。

そんな中Netlifyというすごいサービスがあることを知る。

> HTTPSの静的コンテンツをホストするならs3よりNetlifyが俺の求めていたものだった
> https://qiita.com/shogomuranushi/items/6ab5bc29923b3f82c9ed

+ 1クリックでSSL（Let's encryptの証明書を自動取得・更新）
+ HTTP/2対応
+ CDN標準装備
+ Gitから更新検知して自動ビルド(！)
+ リダイレクト設定可能（独自記法）
+ 独自ドメイン利用可能（SSLもOK）
+ **ここまで全部無料**

要件全部満たしていたので即決！
以下は備忘録なので細かい手順は省いて設定とやったことのみダラダラと記載していく。

## WordPressのデータをHugo用にエクスポートする

[WordPress to Hugo Exporter](https://github.com/SchumacherFM/wordpress-to-hugo-exporter)というWordPressプラグインを利用。WPのプラグインディレクトリに置いて、管理画面にログインして有効化する。あとは1クリックで画像と記事の.mdファイルをZIPでダウンロードできる。以上！

Markdownの仕様上、広告などのインデントが深いとコード記述扱いされてしまうのでVSCodeの置換を使ってシコシコ修正する。

タグやカテゴリ、パーマリンクなどはHugo用のヘッダー部分が作成されており、そこに格納されている。サンプルは以下の通り。

```
---
title: 格安サイコンbryton Rider310を使ってみた
author: gen
type: post
date: 2017-09-27T11:26:26+00:00
#url: /2017/09/rider310review.html
thumbnail: DSC_7899.jpg
categories:
  - 未分類
tags:
  - インプレ
  - ガジェット
```
サムネイルは能動的に設定しないと作ってくれなかったので、自分で全記事に対して作成した…\
urlは所謂パーマリンク設定がそのまま反映される。hugoでは基本的に記事が``/post/記事名/``になってしまうが、この項目に設定をしておけば過去のURLを維持できる。



## Hugoインストール、動作

Chocolatey経由でGoとHugoをインストールする。
作業したいディレクトリ上で``hugo new site``を打てばよろしくディレクトリ構造を作ってくれる。

WPからダウンロードしたMarkdownファイルを``/post/``へ、画像ファイルは``/static/``へそれぞれ移動。
作業ディレクトリに``config.toml``にWEBサイトの情報を投入して準備完了。（エクスポート時に作られたyamlファイルでも可）

自分の場合はこんな感じ。

```
#website setting
title = "幻想サイクル"
baseURL = "http://blog.gensobunya.net/"
languageCode = "ja-jp"
canonifyURLs = false
relativeURLs = true
theme = "mainroad"
googleAnalytics = "UA-xxxxxxx-x"

#system
contentDir = "content"
layoutDir = "layouts"
publishDir = "public"
buildDrafts = false
hasCJKLanguage = true
defaultLayout = "post"
```


検証は``hugo serve``コマンドを打てばlocalhost:1313上にサイトが展開される。
リンクも実際のURLではなくlocalhostによろしく変換されてくれるので便利。

``hugo``コマンドで``/static/``に実際のHTMLが生成されるが、Netlifyの場合はこの作業をGitにアップロードした後勝手にやってくれるので、ローカルで実施する必要はない。gitignoreにぶち込んでおく。

テーマは``/themes/``ディレクトリに移動して公式からテーマファイルをCloneしてくるスタイル。Cloneしたらテーマのフォルダ名を``config.toml``に記載すればビルドの際に記載したテーマが適用される。\
普段と違うテーマを試したい時はビルド時に引数で渡してやれば引数のテーマでビルドされる。


## Netlify用設定

リポジトリのルートディレクトリに``netlify.toml``を作成してHugoのバージョンを記載する（しないと古いバージョンをビルドに使うためエラーになる）

自分の場合v0.27.1を使っていたので下記の通り記載。
```
[context.production.environment]
  HUGO_VERSION = "0.27.1"
```

ここまで書いたら、Github, Gitlab, bitbucketのどれかにリポジトリを作ってプッシュしておく。

Netlifyの会員登録をして、作ったリポジトリと連携すれば自動的にサイトのビルドが実施されてデプロイまで行われる。先程ローカルにあったサイトが生成されていることを確認して終わりだ。

## リダイレクト

[公式ドキュメント](https://www.netlify.com/docs/redirects/)によるとWEBサイトのルートに``_redirect``を作ってそこに記述する。

Hugoの場合、サイトビルド時に変換してほしくないファイルは``/static/``以下に置くことになっているので、画像ファイルなどと一緒にここに配置すればOK。

Bloggerの頃のパラメータと、パーマリンクを維持するために以下の設定を記入。

```
# START paramater 301 redirect
/*param1=:value1   /:splat  301!
# END paramater 301 redirect

# START page 301 redirect
/:year/:month/:date/:slug /:year/:month/:slug 301!
# END page 301 redirect
```
``:year``などのいかにもYYYYを検知してくれそうなプレースホルダーが用意されているが、スラッシュの間ならなんでも認識してしまう罠があった。問い合わせてみたところ仕様らしい。

コンテンツと設定の移行作業はこれで全て完了。
あとは独自ドメインの設定をしてDNSを切り替えればNetlifyのサーバーからサイトが配信される。

Cloudflareを辞める場合、一旦ネームサーバーをGoogleに返す必要があるのでNSレコードを変更して1日待つ必要がある。\
24h後にあらためてGoogle DomainsでNetlifyのサーバーにCNAMEを向けて移行の全作業が終了。

Cloudflare上で予めNetlifyにアクセスを向けておけば移行時間を減らせるかもしれないが、Cloudflare経由でNetlifyから配信することは推奨されていないようなのでやめておいた。