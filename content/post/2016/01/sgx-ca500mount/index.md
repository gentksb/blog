---
title: SGX-CA500を買ったのでGARMINマウントに装着できるようにした
author: admin
type: post
date: 2016-01-09T01:08:00+00:00
#url: /2016/01/sgx-ca500garmin.html
thumbnail: DSC_6950.jpg
categories:
  - 未分類
tags:
  - Zwift
  - REVIEW
  - GADGETS
  - ROAD

---
<div class="separator" style="clear: both; text-align: center;">
  <img border="0" height="360" src="./DSC_6950.jpg" width="640" />
</div>



### サイコンをSGX-CA500に変更

今まで、サイクルコンピューターは<a href="http://www.amazon.co.jp/gp/product/B007PNKROY/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B007PNKROY&linkCode=as2&tag=gensobunya-22" rel="nofollow">GARMIN Edge500</a>の台湾版を使っていた。ペダリングモニターを使っていたのだが、Zwiftをやる関係上、ANT+でパワーを取得しなければならなかったからだ。

ペダリングモニターモード（ペダリング効率を測るモード）だとパイオニアの独自規格となるので、PCにパワーデータを転送できなかった。

ところが、2015/12/24のアップデートで状況が変わった。

<blockquote class="tr_bq">
  <p>
    ・ペダリングモニターのANT+パワーメーター送信 (ベータ版)<br /> &#8211; ペダリングモニターから受信したペダリングパワーを、ANT+で規定されているパワーメーターフォーマットに変換しSGX-CA500から送信する機能を追加しました。<br /> <a href="https://cyclo-sphere.com/notice/20151224/ja">https://cyclo-sphere.com/notice/20151224/ja</a>
  </p>
</blockquote>

ペダリングモニターモードのまま、センサーではなくサイコンからANT+形式でパワー値を取れるようになった。つまりペダリングモニターしながらZwiftが可能になった。

これで購入を即決断。



### パイオニア専用マウント→GARMINマウントへ変換する

<div class="separator" style="clear: both; text-align: center;">
  <img border="0" height="360" src="./DSC_6947.jpg" width="640" />
</div>

この記事の本題。サイコンを変えても3台の自転車にひっついているサイコンマウントはGARMIN用のまま。

純正のマウントは4000円近くするので、なんとか既存のマウントを流用したい…

そこで、REC-MOUNTの<a href="http://www.amazon.co.jp/gp/product/B00MUNVW52/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B00MUNVW52&linkCode=as2&tag=gensobunya-22" rel="nofollow">GM-SGX2</a>を利用した。

本来はSGX-CA500をREC-MOUNTの製品に装着できるようにするもの。GARMIN用ではないので、写真の通り、形が微妙に違う。

<div class="separator" style="clear: both; text-align: center;">
</div>

<div class="separator" style="clear: both; text-align: center;">
  <img border="0" height="360" src="./DSC_6948.jpg" width="640" />
</div>

このままだと、上下の爪に邪魔されてマウントに入らないので、ニッパーで爪を削り飛ばし、ヤスリで整える。

**※2016/10/26追記**

タレコミによると現行品は爪が2つになっており、わざわざ加工しなくてもいいらしい

下が加工後の状態。

<div class="separator" style="clear: both; text-align: center;">
  <img border="0" height="360" src="./DSC_6949.jpg" width="640" />
</div>

左右の爪だけの状態になっていることがお分かりいただけるかと思う。

ちなみにこれ、結構シビアで完全になめらかになるまで削らないと手持ちの<a href="http://www.amazon.co.jp/gp/product/B00843DVCY/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B00843DVCY&linkCode=as2&tag=gensobunya-22" rel="nofollow">Bar Fly</a>には入らなかった。

冒頭の写真が装着後の状態。

かなり厚みがあるのでエアロ効果は低くなったかもしれない（笑

<div class="separator" style="clear: both; text-align: center;">
  <img border="0" height="360" src="./DSC_6950.jpg" width="640" />
</div>



### SGX-CA500自体のインプレ



#### GPS

Edge500に比べると格段にGPSのつかみが良くなった。みちびき対応のおかげらしい。

信号ストップや再スタートの際もほとんどタイムラグ無くオートスタートが発動してくれる。

#### パワーメーター

どのサイコンでもパワー値の反映には時間がかかると思うが、こいつも例に漏れずタイムラグがそれなりにある。ローラー以外で注視することはないので問題はない。

それよりも、ゼロ点校正が非常にスピーディーになったことが素晴らしかった。

メニューをポチッとしたら数秒で完了している。Edge500でクランクを空転させないといけなかった（しかもよく失敗する）ことを考えると大きな進歩だ。



#### UI

端的に言って悪い。感圧式タッチパネルなのだが、スクロールのつもりがタップになることもしばしば。

タップしても動作が重いのも気になった。AndroidベースのOSなのだが2.3あたりをベースにしているんじゃなかろうか…という推測。Androidアップデートを頼む。

ST-9070を使っているしワイヤレスユニットが欲しくなるくらいタッチパネルを使いたくない。サイコンくらいの画面サイズだと物理スイッチのほうが便利だとなぜ各社わからないのか。

#### Wi-Fiアップロード

Edge510以降を利用している人ならわかると思うが、非常に便利。アップロードメニューを選択すると自動で未送信のワークアウトを認識し、WiFiをONにしてアップロードしてくれる。アップロードしたらWi-Fiはオフになるし優秀。

サイコン単体でファームウェアアップデータが可能になっていることも、Edge500ユーザーからすると点数高い。



### サイクルコンピューターとしてのSGX-CA500

普通のサイクルコンピューターとしては少し操作に難がある。

非ペダリングモニターユーザーは、<a href="http://www.amazon.co.jp/gp/product/B015IW5SKG/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=B015IW5SKG&linkCode=as2&tag=gensobunya-22" rel="nofollow">Edge520J</a>の方が使いやすいと思う。Bluetoothも使えるし。

逆に、ペダリングモニターと組み合わせるのであればベストと言っていい。

これがないと効率やベクトルデータは保管できない。今はこれらのデータを活用するノウハウができているとは言いがたいが、将来的に価値が上がるかもしれないし、蓄積しておくに越したことはない。

何よりサイコンから校正やファームウェアアップロードがサクサク行えるのが非常に良い。

専用サイトである<a href="https://cyclo-sphere.com/" target="_blank">シクロスフィア</a>の使い心地については後ほどレポートしようと思う。


<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B01874O84Y/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/51YRe1czRUL._SL160_.jpg" alt="Pioneer(パイオニア) サイクルコンピューター Wifi ANT+対応 トレーニングメニュー・データ解析Webサービス付 SGX-CA500 SGX-CA500" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B01874O84Y/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Pioneer(パイオニア) サイクルコンピューター Wifi ANT+対応 トレーニングメニュー・データ解析Webサービス付 SGX-CA500 SGX-CA500</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 19.04.15</div></div><div class="amazlet-detail">Pioneer(パイオニア) (2014-03-20)<br />売り上げランキング: 101,786<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B01874O84Y/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B00MUNVW52/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/31Gb1usE1KL._SL160_.jpg" alt="REC-MOUNTST(レックマウント) サイクルコンピューター用アダプター パイオニア ペダリングモニター SGX-CA500 用[GM-SGX2]" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B00MUNVW52/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">REC-MOUNTST(レックマウント) サイクルコンピューター用アダプター パイオニア ペダリングモニター SGX-CA500 用[GM-SGX2]</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 19.04.15</div></div><div class="amazlet-detail">レックマウント <br />売り上げランキング: 200,411<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B00MUNVW52/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>
