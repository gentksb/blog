---
title: 'HTC J(ISW13HT) root&CWM'
author: admin
type: post
date: 2013-01-20T02:19:00+00:00
url: /2013/01/htc-jisw13ht-roo.html
blogger_bid:
  - 443169423969093484
blogger_blog:
  - blog.gensobunya.net
blogger_id:
  - 6917140134796403118
blogger_author:
  - 05415749641252153199
blogger_permalink:
  - /2013/01/htc-jisw13ht-root.html
categories:
  - 未分類
tags:
  - ガジェット

---
HTC Jを手に入れたのでroot取ったりROM突っ込んだりして遊ぶことにしました。

まずはroot環境構築から。

幸い、HTCの機種には@fnojiさん作成の[HTC速報][1]があるため、情報には困りません。

http://htcsoku.info/htcsokudev/2012device/valentewx/root/

http://kesemoi.blog113.fc2.com/blog-entry-1148.html

を参考に、本体のバージョンを最新にしてからツールにしたがって作業するだけ…と思っていたら思わぬ敵が。

途中過程でHTCdevからブートローダーのアンロックコードを手に入れる必用があるのですが、このサイトが非常に重くて復旧するまで数日おあずけ(´・ω・｀)

以下備忘録

0. HTCdevのアカウント取得。

1. HTCJRootkit ver3.1内にあるsu.zipを本体のルートディレクトリに（本体側をストレージモードにしておく）

2. runnme.bat起動、指示に従う。

3. runnme2.bat起動、最初にもう一度復元をかけるので勢いでEnterを押さないこと。

runnme.batは閉じる

4. ScoopCID.bat起動、範囲選択は右クリ、コピーはEnterキー

5. HTCdevのBLUnlockのページから「other devices」を選択してStep9のところにキーを入れる

6.ScoopCID.batに戻って指示に従う。

7.runnme2.batに戻って指示に従う。

コードを手に入れてからは非常に簡単でした。公式でBLアンロックできるのはうれしいらしですね（よくわかっていない）

私のような素人にとっては、ソニー製端末におけるSEUSのような復旧アプリがないので自然と少し慎重にならざるを得ませんｗ

次はCWM、カスタムROMの導入

参考サイトはこれら。

http://htcsoku.info/htcsokudev/2012device/valentewx/port-customrom/

http://kura-nikki.jugem.jp/?eid=15

[CWM]

1. adb rebooot bootloader

2. cd d/ [ディレクトリ]

3. fastboot flash recovery test.img

[ROM]

1. adb reboot recovery

2. Install from ZIP

3. Choose from ZIP

実行前にICSの機能を使ってバックアップも取っています

参考：http://degi.doorblog.jp/archives/20900398.html

rootedのシステムバックアップを取ってどうなるのかという問題はさておき（いい子はroot取る前にバックアップしましょう）

香港版のROMを焼いてrootedするところまではうまくいきました。

次の記事はS-offとW-CDMA化です
 [1]: http://htcsoku.info/