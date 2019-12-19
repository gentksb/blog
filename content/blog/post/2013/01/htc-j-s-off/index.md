---
title: HTC J S-OFF備忘録
author: admin
type: post
date: 2013-01-25T05:55:00+00:00
tags: ["GADGETS"]
draft: true
---

参考

<http://pub.slateblue.tk/memo/day2788.html>

<http://cielsomer.blog.fc2.com/blog-entry-392.html>

ほぼ引用です。前提として BL アンロックしています

0. adb reboot bootloader

1.リロック

fastboot oem lock

2.RUU を焼く

fastboot erase cache

fastboot oem rebootRUU

fastboot flash zip RUU.zip→90or92 エラー吐いたらもう 1 回

3.fastboot reboot

4.Temproot 作業

HTC 速報さんの記事より、HTCJrootkit_v3.1.rar を解凍

USB デバッグ ON

runme.bat 実行＞ runme2.bat 実行。

以下表示で Enter 押す所まで、実行。

&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-

SuperCID に書き換える準備をします。

＜＜起動後＞＞(壁紙のみの表示）何かキーを押してください。

&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-

「 同梱の 「Spoof-CID.bat」 を起動して下さい。」と出たら、

窓を閉じる

5.adb shell で末尾が＃になっていることを確認する

6.RabiesShot.exe を**右クリ → 管理者権限で実行**

Complete するまでほおっておく。

7. fastboot flash unlocktoken Unlock_code.bin

8.BOOTLOADER→FACTRY RESET

9. CWM を焼きなおして su を入れる

メモ：S-OFF→Unlock→CWM→SU→WCDMAEnabler

LTE ON/OFF

WCDMA 化は苦戦中です。一度できたのですが HKROM だとモバスイ使えないので庭 ROM でやろうとしたら全く成功せず…
