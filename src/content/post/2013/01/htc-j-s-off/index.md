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

ほぼ引用です。前提としてBLアンロックしています

0. adb reboot bootloader

1。リロック

fastboot oem lock

2.RUUを焼く

fastboot erase cache

fastboot oem rebootRUU

fastboot flash zip RUU.zip→90or92エラー吐いたらもう1回

3.fastboot reboot

4.Temproot作業

HTC速報さんの記事より、HTCJrootkit_v3.1.rarを解凍

USBデバッグON

runme.bat実行＞ runme2.bat実行。

以下表示でEnter押す所まで、実行。

&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-

SuperCIDに書き換える準備をします。

＜＜起動後＞＞(壁紙のみの表示）何かキーを押してください。

&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-

「同梱の「Spoof-CID.bat」を起動して下さい」と出たら、

窓を閉じる

5.adb shellで末尾が＃になっていることを確認する

6.RabiesShot.exeを**右クリ → 管理者権限で実行**

Completeするまでほおっておく。

7. fastboot flash unlocktoken Unlock_code.bin

8.BOOTLOADER→FACTRY RESET

9. CWMを焼きなおしてsuを入れる

メモ：S-OFF→Unlock→CWM→SU→WCDMAEnabler

LTE ON/OFF

WCDMA化は苦戦中です。一度できたのですがHKROMだとモバスイ使えないので庭ROMでやろうとしたら全く成功せず…
