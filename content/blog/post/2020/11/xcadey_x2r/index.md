---
title: "XCADEY X2Power Right-sideパワーメーターレビュー"
date: 2020-11-03
draft: false
tags: ["REVIEW", "ROAD"]
cover: "./cover.jpg"
---

![アイキャッチ](./cover.jpg)

AliExpress でよくみる中華パワーメーター筆頭である XCADEY の右クランク単体を購入した。\
総評としては「久しぶりに中華製品の醍醐味を味わったぜ…」というところ。

## XCADEY のパワーメーターラインナップ

ラインナップは[公式ショップ](https://xcadey.com/shop/)を見るのが分かりやすい。

左側クランク単体・スパイダー・両側システムが大きな区分で、補修パーツ扱いで右だけのメーターも販売しているというのが公式のラインナップ。\
左側クランクはバッテリー式とコイン電池式がある。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://s.click.aliexpress.com/e/_AprDnl" data-iframely-url="//cdn.iframe.ly/uXDV8CD"></a></div></div>

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://s.click.aliexpress.com/e/_A4DPRH" data-iframely-url="//cdn.iframe.ly/BGkOUiP"></a></div></div>

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://s.click.aliexpress.com/e/_9Qq8Xt" data-iframely-url="//cdn.iframe.ly/LCqRukR"></a></div></div>

AliExpress のセラーには、公式に存在しない謎の右クランクメーターも。何故か両側 PM の最新版は自分が右側を買った後に AliExpress から姿を消し、しょっぱなから不穏。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://s.click.aliexpress.com/e/_A3KpYJ" data-iframely-url="//cdn.iframe.ly/RIREE0S"></a></div></div>

## Unboxing

![届いたところ](./packing.jpg)

梱包はプチプチにくるまれただけの手軽なもの。中身は冒頭の精密ドライバーと USB ケーブル、説明書のみ。

USB ケーブルは専用充電端子となっている。マグネット接続だが、磁力はそれほど強くはない。

![USB](./charge.jpg)

説明書はあまりにも役に立たなくて笑う。ちなみに QR コードを読んで公式に行ってもこれ以上の情報はない。

![説明書](./howto.jpg)

本体の出来は…見た目上悪くはない。むしろひずみゲージと本体の接続にケーブルを露出させていたパイオニアよりすっきりしているとすら言える。

![裏側1](./behind.jpg)

![裏側1](./behind2.jpg)

充電中は赤 LED が点灯し、外すと青と緑の LED が 1 回点滅する。その後も青い LED が定期的に点灯するが、これが何を意味するのか説明書がないので全くわからない。まぁ、点灯していれば起動しているということは判別できる。

## 装着・テスト

![looks](./looks.jpg)

![Clearance](./clearance.jpg)

マグネットレスシステムなので、フレーム側への加工は不要。右側 PM にこだわった理由のクリアランスも当然バッチリ。ウルフトゥースのチェーンリングボルトの方が張り出しが大きいので、実質どんなフレームにも使えるだろう。[Edge530](https://amzn.to/362FR4i) とのペアリングもつつがなく終了。

余談だが、検品が終わって装着ができても AliExpress の"Received"を押してはいけない。完全に動作することを確認してから受領する。

まずは適当な登りで動作を確認してみる。信号や下りでパワーが 0 になるタイミングのないセグメントが最適。

![signal](./signal_lost_1.png)

![signal](./signal_lost_2.png)

あっ…これはおかしいですね…**パワー値出してません**ね…

## ファームウェアアップデート戦争

Dispute ボタンを押しつつ、なんとか使えないかとファームウェアアップデートを確認してみる。ソフトウェア側が原因であれば、アップデートで直る可能性はある。

XCADEY のアプリをダウンロードして、クランクを回してパワーメーターを起動するとデバイスリストにパワーメーターが表示されるようになる。

…

……

なるほど、**XPOWER-L**と表示されたデバイスがある。買ったものは 2XPOWER の R なんだけど、本体にも 2XPOWER って書いてあるし…\
ググってみると、Firmware Update のボタンを長押しすると別機種のファームウェアをインストールできる模様。とんでもない仕様だ。別機種のファームウェア書き込んだら普通壊れると思うが、そもそも別機種のファームウェアが出荷時点で入っているとは思わなかった。

さっそく 2XPOWER-R のファームウェアを書き込んでみる。ちなみに、何故かアプリとのペアリングは充電をした後端子を外したタイミングでないと上手くいかない。

![update](./update_firm.png)

ファームウェアアップデート自体は 1 分ほどで終了。すると、サイコンとの接続がうまくいかなくなった…ので、別機種のファームウェアを試してみる。

いくつか試すうちに 2XPOWER（左右表示なし）のファームウェアをインストールしたら、パワー値が半分になった（なるほど）。それだけならいいのだが、Android アプリからパワーメーターとペアリングできなくなりにっちもさっちもいかない事態になってしまった。

この段階では自力でどうしようもないので、サポートを頼ることに。Facebook/Instagram とメールが連絡先に指定されていたので全チャンネルにコンタクトしてみたところ、Facebook から最初に返答があった。

たぶん、ハードリセットする本体ボタンとかあるだろうと思っていた、この時は。

![サポート](./xcadey_troubleshoot.png)

要約「iPhone アプリから接続してね！他の方法はないよ！あっ、ファームウェアをインストールするときは**XPOWER-R**のやつを使ってね！」

色々ツッコミたいが、iPhone は持っていないので友人宅で接続とファームウェアアップデートを実施。これは無事成功。中華製品で Android より iPhone が優先されることあるんだ…

![iPhone](./fix_update.jpg)

自宅では気が付かなかったが、この XCADEY アプリ、パワーメーター以外の製品とペアリングしてもあたかもパワーメーターとペアリングしたようにふるまうことがある上、アップデートがフリーズしてもダイアログの裏で色々操作できる。テストしてるのか不安になる。

## 修正後動作確認

![正常化？](./success.png)

サポートの言う通り、違う機種のファームウェアを当てたのでひとまず動作確認したところ、出荷時ファームウェアで確認されたデータ欠落は今のところ起きていない（ように見える）\
肝心のパワー値は Suito 比で 5%くらいハッピーメーター。どちらが精度の高い値なのかはわからないが…

"Pair Dual-sided"というメニューがあるということは、両側を買った後はデュアルパワーメーターとして使えるのだろうが、その際に 2XPower でないファームウェアでペアリングできるのかどうか怪しい気もする。

ひとまず使えるようにはなったが、中華製品らしいお付き合いが必要になりそう。

## スパイダーや左クランクは比較的信頼できる？

ここからはただの妄想なのだが、購入した右クランクが早々にストアから消えたり、4iiii などの有名どころや他の中華セラー（Magene や SIGEYI）がつい最近まで右クランク PM を商品化していなかったことを考えると、右クランクはひずみゲージと本体が一体化できないなどの制約から開発が難しい？ような雰囲気があるように思える。

一体化していればいいという点であれば、スパイダー式のレビューが意外と外れ個体でない点にも合点がいく。左クランクの PM を買うならおとなしく 4iiii 製品を買った方が信頼性も高いし値段も大して変わらないので左クランクの中華製品を買う意味はほぼない。スパイダーは価格的な優位がある。

ただ、グラベルバイクのようなクリアランスが狭いバイクだったり、欧米海外通販で無い長さのクランク長を選択できたりと右クランクオンリーにもニッチな場所で意味があったりする。クランクの右側だけを調達するのは大変だけども左だけならかなり安く調達できたりもする。

## 覚悟があるなら独身の日を待て

11/11 は AliExpress で盛大なセールが開催される。SIGEYI の[スパイダー式](https://s.click.aliexpress.com/e/_A8c2uT)や Megane の[デュアル PM](https://s.click.aliexpress.com/e/_AlRWLp)がセールとなるので、覚悟と理解があればチャレンジしてみてはいかがだろうか？おすすめはしないけども。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://s.click.aliexpress.com/e/_A8c2uT" data-iframely-url="//cdn.iframe.ly/NelXeBU"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>
