---
title: "WEBサービスを駆使して体調やトレーニングログを可視化しよう"
date: 2020-03-29
draft: false
tags: ["TIPS"]
cover: "./healthcare_relation.png"
---

![cover](./healthcare_relation.png)

## 活用せずともデータを残そう

距離・速度・心拍・パワー…自転車に乗っていると様々なデータを取ることができます。

サイクルコンピューターを使って距離・速度を測って GPS ログをアップロードするのはもはや定番ですが、心拍やパワーに関しては「使わないから…」と思ってデータを蓄積していない人もいるのでは？

以前はこれらのデータから色々自分で計算して、必要な指標（TSS や CTL）を出したり、ベースとなる心拍数や FTP を算出したり…とかなり面倒な作業でしたが、今日ではこれらのクソ面倒な作業は全て WEB サービス側でやってくれます。

結果として、トレーニング目的ではなくとも「自分は同年代でどれほどの能力を持っているのか？」「今回のライドの回復に必要な時間はどれくらいなのか？」など、活用方法を勉強しなくてもわかりやすいフィードバックが得られるようになっています。データがあればあるほどこれらは精確になっていきます。

※ペダリングモニターのデータのようにいつまで経っても定量的に活用できないデータもありますが、まずは気にせず溜めましょう

## 基本編：まずは運動時のログを貯める

これは、好きなサイクルコンピューターかスマートウォッチを買って GPS・心拍のログを取るだけです。今から買うなら、Edge530 以上のモデルを選ぶことをおすすめします。520 以前のモデルに比べてハードソフト共にかなり進歩しています。

心拍計かパワーメーターがあると消費カロリーの数値が信憑性を帯びてきます。距離と体重・GPS ログだけだと、やや信頼性に欠けます…

インプレは[本体の過去記事](/post/2019/08/edge530j/)と、[MTB ダイナミクスインプレ](/post/2019/11/edge530_mtbd/)にて。

<div class="amachazl-box" style="margin-bottom:0px;"><div class="amachazl-image" style="float:left;margin:0px 12px 1px 0px;"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07V4DG1DK/gensobunya-22/" name="amachazllink" target="_blank"><img src="https://m.media-amazon.com/images/I/41nWG3UXbVL._SL160_.jpg" alt="GARMIN(ガーミン) EDGE 530 日本語版 GPSサイクルコンピューター(単体) 004476" style="border: none;" /></a></div><div class="amachazl-info" style="line-height:120%; margin-bottom: 10px"><div class="amachazl-name" style="margin-bottom:10px;line-height:120%"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07V4DG1DK/gensobunya-22/" name="amachazllink" target="_blank">GARMIN(ガーミン) EDGE 530 日本語版 GPSサイクルコンピューター(単体) 004476</a><div class="amachazl-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="https://amachazl.com/browse/B07V4DG1DK/gensobunya-22" title="GARMIN(ガーミン) EDGE 530 日本語版 GPSサイクルコンピューター(単体) 004476 - 甘茶蔓 (amachazl)" target="_blank">amachazl</a> at 2020.03.29</div></div><div class="amachazl-sub-info" style="float: left;"><div class="amachazl-link" style="margin-top: 5px"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07V4DG1DK/gensobunya-22/" name="amachazllink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amachazl-footer" style="clear: left"></div></div>

## 応用編：日常生活もモニタリングしよう

もしあなたがプロのスポーツ選手で、自転車に乗っていない時間は全て休息時間なら、パワートレーニングの数値や回復日数は既に信頼性のあるものになっています。

ただし、一般的には運動時に加えて平日の疲労（いわゆる仕事の TSS）があったり、日常生活にどの程度運動が組み込まれているかどうかは無視されてしまっているため、まだ現実を反映した数値とは言い切れません。

そこで、日常の運動や心拍を測って生活の全てを数値化できるようにしていきます。活動量計・スマートウォッチが役に立ちます。サイコンを持っていても必携です。

私が使っている ForeAthelete45/45S は、薄くて軽くて日常生活で使っていても違和感が少なく非常におすすめです。持っている人は Apple Watch でもいいでしょう。

<div class="amachazl-box" style="margin-bottom:0px;"><div class="amachazl-image" style="float:left;margin:0px 12px 1px 0px;"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07WG1QZHJ/gensobunya-22/" name="amachazllink" target="_blank"><img src="https://m.media-amazon.com/images/I/311bCYwRq4L._SL160_.jpg" alt="ガーミン フォアアスリート 45 / 45S GARMIN ForeAthlete 45 / 45S フォアアスリート + GARMIN(ガーミン) 液晶保護フィルム FA645/245用と、TRAN(トラン)(R)マイクロファイバークロスセット (ブラック)" style="border: none;" /></a></div><div class="amachazl-info" style="line-height:120%; margin-bottom: 10px"><div class="amachazl-name" style="margin-bottom:10px;line-height:120%"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07WG1QZHJ/gensobunya-22/" name="amachazllink" target="_blank">ガーミン フォアアスリート 45 / 45S GARMIN ForeAthlete 45 / 45S フォアアスリート + GARMIN(ガーミン) 液晶保護フィルム FA645/245用と、TRAN(トラン)(R)マイクロファイバークロスセット (ブラック)</a><div class="amachazl-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="https://amachazl.com/browse/B07WG1QZHJ/gensobunya-22" title="ガーミン フォアアスリート 45 / 45S GARMIN ForeAthlete 45 / 45S フォアアスリート + GARMIN(ガーミン) 液晶保護フィルム FA645/245用と、TRAN(トラン)(R)マイクロファイバークロスセット (ブラック) - 甘茶蔓 (amachazl)" target="_blank">amachazl</a></div></div><div class="amachazl-detail">売り上げランキング: 8,393<br /></div><div class="amachazl-sub-info" style="float: left;"><div class="amachazl-link" style="margin-top: 5px"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B07WG1QZHJ/gensobunya-22/" name="amachazllink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amachazl-footer" style="clear: left"></div></div>

### 睡眠と安静時心拍とコンディション

![sleepAndLowHeartRate](./lowHeartrate.png)

睡眠時間と安静時心拍は、自分のコンディションを把握する上でかなり重要な数値です。経験上、これらが最もレース結果や体感的な調子の良さに関わってきます。

安静時心拍が高い（自分の場合は 50 に近づく場合）ときは慢性疲労している可能性が高いです。ベースラインとなる安静時心拍は人によって異なるので、自分なりの基準を見つけるためにも継続的に測っておく必要があり、スマートウォッチを付けた生活は欠かせません…

シクロクロスに限って言えば糖質消費が激しいので前日にドカ食いすると翌日のレースの調子がいいなんてこともありますが、それよりも心肺を含めた体調を整えるのは大前提。回復には睡眠が欠かせません。

![sleepAndLowHeartRate](./sleep.png)

週の平均睡眠時間が下がったら、忙しすぎを心配してもいいでしょう。

## カロリー収支をモニタリングしよう

ここまで来ると、「1 日に何 kcal 自分が消費しているか」能動的に何かを行わなくても自動的に算出されるようになります。

そうすると、次にやることは当然摂取カロリーの可視化です。UNDER ARMOUR 社が提供している[myfitnesspal](https://www.myfitnesspal.com/ja/)を使うと、食材もしくはメニューから簡単に摂取カロリーを計算できます。

<div class="appreach"><img src="https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/37/a7/b1/37a7b1fd-e53c-0f07-4454-d2dd3bbcb875/source/512x512bb.jpg" alt="MyFitnessPal" class="appreach__icon"><div class="appreach__detail"><p class="appreach__name">MyFitnessPal</p><p class="appreach__info"><span class="appreach__developper">Under Armour, Inc.</span><span class="appreach__price">無料</span><span class="appreach__posted">posted with<a href="https://mama-hack.com/app-reach/" title="アプリーチ" target="_blank" rel="nofollow">アプリーチ</a></span></p></div><div class="appreach__links"><a href="https://apps.apple.com/jp/app/myfitnesspal/id341232718?uo=4" rel="nofollow" class="appreach__aslink"><img src="https://nabettu.github.io/appreach/img/itune_ja.svg"></a><a href="https://play.google.com/store/apps/details?id=com.myfitnesspal.android" rel="nofollow" class="appreach__gplink"><img src="https://nabettu.github.io/appreach/img/gplay_ja.png"></a></div></div>

なおかつ、目標体重を設定することで GARMIN CONNECT や STRAVA から消費カロリーをインポートできるので、一日の消費カロリーと摂取カロリーを比較して理想的なバランスになっているか毎日モニタリングすることができます。栄養組成目標も無料で設定できるので、タンパク質をベースに目標設定しています。

![myfitnesspal](./mfp1.png)

![myfitnesspal](./mfp2.png)

食事は毎日入力する必要があるので、中々面倒ですが頑張りましょう。自分はすぐ太るので危機感だけで頑張っています。

## 体重をモニタリングしよう

![withings](./withings.png)

体重は[withings の body+](https://www.amazon.co.jp/exec/obidos/ASIN/B071ZG8JP2/gensobunya-22/)をを愛用しています。

同期が Bluetooth 経由ではなく、Wifi 経由なので一度設定すれば一々スマホとのペアリングを待たなくても体重計に乗るだけで記録がどんどんアップロードされていくので非常にお手軽です。

体重を記録するだけでなく、GARAMIN CONNECT や先ほど紹介した myfitnesspal に連携できる点がミソです。タニタなど国内メーカーはどうにもこの点が弱いので…IFTTT に対応してくれれば何でもできるんですが、どうにもイケてない…

<div class="amachazl-box" style="margin-bottom:0px;"><div class="amachazl-image" style="float:left;margin:0px 12px 1px 0px;"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B071ZG8JP2/gensobunya-22/" name="amachazllink" target="_blank"><img src="https://m.media-amazon.com/images/I/31Pa4HV9JyL._SL160_.jpg" alt="Withings Body + フランス生まれのスマート体重計 ホワイト Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-WHITE-ALL-JP" style="border: none;" /></a></div><div class="amachazl-info" style="line-height:120%; margin-bottom: 10px"><div class="amachazl-name" style="margin-bottom:10px;line-height:120%"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B071ZG8JP2/gensobunya-22/" name="amachazllink" target="_blank">Withings Body + フランス生まれのスマート体重計 ホワイト Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-WHITE-ALL-JP</a><div class="amachazl-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="https://amachazl.com/browse/B071ZG8JP2/gensobunya-22" title="Withings Body + フランス生まれのスマート体重計 ホワイト Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-WHITE-ALL-JP - 甘茶蔓 (amachazl)" target="_blank">amachazl</a> at 2020.03.29</div></div><div class="amachazl-sub-info" style="float: left;"><div class="amachazl-link" style="margin-top: 5px"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/B071ZG8JP2/gensobunya-22/" name="amachazllink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amachazl-footer" style="clear: left"></div></div>

## WEB 連携！

![system_architecture](./healthcare_relation.png)

これまで挙げてきたサービスは全て WEB API を使ってデータを単方向・双方向に連携することができます。これで様々な数値が自動で別サービスに同期されて圧倒的な利便性を享受できます

- withings スケールで測った体重が Strava・GarminConnect・Zwift に連携して FTP/kg を自動更新
- GarminConnect/Strava のアクティビティ消費カロリーを Myfitnesspal に連携して毎日のカロリー収支を可視化
- GoogleFit/Apple Healthcare に健康情報をストック

各アプリで、「パートナーアプリ」「アプリ連携」「連携」などをクリックすると、それらの WEB サイトに飛んでそれぞれのアカウントでログインするだけでデータ連携を設定できます。中国系のサイクルコンピューターやスマートバンド・スマートウォッチはこのあたりが充実していないのが良くない点ですね…

Google fit への連携はあまり流行っていないので、有志が作成した[Health sync](https://play.google.com/store/apps/details?id=nl.appyhapps.healthsync&hl=ja)というアプリを通しています。

![strava](./strava.png)

![mfp](./mfp.png)

![nokia](./nokia.png)

![connect](./connect.png)

![health sync](./healthsync.png)

Zwift はいまお休みしているので入っていませんが、Withings の Health Mate からは直接 Zwift に体重を送って体重計に乗ったら Zwift の体重を更新することもできます！

人力での入力は Myfitnesspal の食べた食品品目のみ！これをサボったとしても運動するときのデバイス ON と体重計に乗ることさえ忘れなければヘルスケア系のログを全て取ることができるようになりました。

いくらものぐさでな人間でもこれぐらいは続く…続きますよね？
