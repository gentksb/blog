---
title: "HTC J(ISW13HT) root&CWM"
author: admin
type: post
date: 2013-01-20T02:19:00+00:00
tags: ["GADGETS"]
draft: true
---

HTC J を手に入れたので root 取ったり ROM 突っ込んだりして遊ぶことにしました。

まずは root 環境構築から。

幸い、HTC の機種には@fnoji さん作成の[HTC 速報][1]があるため、情報には困りません。

http://htcsoku.info/htcsokudev/2012device/valentewx/root/

http://kesemoi.blog113.fc2.com/blog-entry-1148.html

を参考に、本体のバージョンを最新にしてからツールにしたがって作業するだけ…と思っていたら思わぬ敵が。

途中過程で HTCdev からブートローダーのアンロックコードを手に入れる必用があるのですが、このサイトが非常に重くて復旧するまで数日おあずけ(´・ω・｀)

以下備忘録

0. HTCdev のアカウント取得。

1. HTCJRootkit ver3.1 内にある su.zip を本体のルートディレクトリに（本体側をストレージモードにしておく）

1. runnme.bat 起動、指示に従う。

1. runnme2.bat 起動、最初にもう一度復元をかけるので勢いで Enter を押さないこと。

runnme.bat は閉じる

4. ScoopCID.bat 起動、範囲選択は右クリ、コピーは Enter キー

5. HTCdev の BLUnlock のページから「other devices」を選択して Step9 のところにキーを入れる

6.ScoopCID.bat に戻って指示に従う。

7.runnme2.bat に戻って指示に従う。

コードを手に入れてからは非常に簡単でした。公式で BL アンロックできるのはうれしいらしですね（よくわかっていない）

私のような素人にとっては、ソニー製端末における SEUS のような復旧アプリがないので自然と少し慎重にならざるを得ませんｗ

次は CWM、カスタム ROM の導入

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

実行前に ICS の機能を使ってバックアップも取っています

参考：http://degi.doorblog.jp/archives/20900398.html

rooted のシステムバックアップを取ってどうなるのかという問題はさておき（いい子は root 取る前にバックアップしましょう）

香港版の ROM を焼いて rooted するところまではうまくいきました。

次の記事は S-off と W-CDMA 化です
[1]: http://htcsoku.info/
