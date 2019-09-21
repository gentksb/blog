---
title: "Withingsの体組成計を買って、GASでSlackの減量チャンネルにポストする"
date: 2019-07-19T22:13:23+09:00
draft: false
tags: ["CODE"]
featuredImage: "./IMG_20190718_180730.jpg"
---
![image](./IMG_20190718_180730.jpg)
## ものぐさレコーディングダイエット

減量できたことないけど、いろんな事を記録して可視化するのはいいこと。  
そして、体重の崩壊を防ぐ仲間内Slackでは、このようにpostした体重と体脂肪率をグラフ化してくれるスクリプトがすでに動いています。

![image](./weight.png)

![image](./fatpercentage.png)

postしたusernameを自動的に取得して、それぞれの人の記録をトレンド含め表示してくれています。  
今までは、愛用していた[TANITAの体組成計](https://amzn.to/2Lv42AS)から手動でメモしていたのですが、いかんせん朝にメモ作業するのは結構面倒。目も疲れるし。

そこで、Wi-Fi対応の体組成計を購入して、乗ったら自動的にSlackに体重と体脂肪率を飛ばすシステムを作りました。  
白羽の矢がたった機種がこちら。

体重の計測は200g刻みと、21世紀の体重計とは思えない精度ですが計測結果が100g程度変動していたところで一喜一憂するものでもなし、インターネット直結という点を重視しました。

<div class="amazlet-box" style="margin-bottom:20px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/31owzwXkO%2BL._SL160_.jpg" alt="Withings Body + フランス生まれのスマート体重計 ブラック Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-BLACK-ALL-JP" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Withings Body + フランス生まれのスマート体重計 ブラック Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-BLACK-ALL-JP</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 19.07.19</div></div><div class="amazlet-detail">Withings (2017-06-20)<br />売り上げランキング: 729<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>

## とりあえずIFTTT

計測した内容は[Withings Health Mate](https://www.withings.com/jp/ja/health-mate)というWEBサービスにアップロードされ、モバイルアプリでも閲覧できます。  
本体の設定はすべてモバイルアプリ経由なので楽ちん。このサービス自体がIFTTTに対応しているので、まずは直接IFTTTを使ってSlackに連携してみます。

![image](./IFTTT_slack.PNG)

骨量や筋肉量、水分量も計測できるのですがAPIで取得できるのは「体重」「前回体重差」「体脂肪量」「前回体脂肪量差」「体脂肪率」「計測日時」の6点のみでした。  
こちらのIFTTTアプレットの起動結果がこちら。

![image](./IFTTT_post.PNG)

連携はできましたが、一つ思い出してください。

>postしたusernameを自動的に取得して、それぞれの人の記録をトレンド含め表示してくれています。

IFTTTのbotアカウントがpostするだけだとグラフ化の方のbotが正常に動いてくれません。自分のアカウントがpostしたことにしないと…  
ちなみにコードを書かなくてもMyfitnessPal経由でGARMIN CONNECTやSTRAVAに体重を連携できるので単体でも結構便利です。

## Slack APIを直接叩こう

[Slack APIの仕様](https://api.slack.com/methods/chat.postMessage)によると、`chat.postMessage`の`as_user`オプションを`true`にしてPOSTすればいいようです  
IFTTTのオプションにはないので直接何かしらのスクリプトを起動することにします。

![image](./diagram.png)

どこで実行するかが問題ですが、データの受け皿を用意しつつ無料でスクリプトを動かせるとなると、やっぱりGoogle SpreadSheetとApps Scriptがシンプルで簡単です。
tokenの取得やアプリの登録に関しては割愛します。

一回、IFTTTでスプレッドシートにデータを飛ばしてカラムを確認した後に以下のスクリプトを、編集をトリガーに設定して実行します。
Date,Weight,Weight w/o fat,Fat weight,Fat Percentの順に4カラムIFTTTで入力しています。

```JavaScript
function getLatestWeightData(){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRawNum = sheet.getLastRow();
  const dataRange = sheet.getRange(lastRawNum, 1, 1, 5) //Date,Weight,Weight w/o fat,Fat weight,Fat Percent
  const postData = {
    "weightKg": dataRange.getValues()[0][1], 
    "fatPercent": dataRange.getValues()[0][4]
  }
  Logger.log(postData)
  return postData
}


function postMeasureDataToSlack() {
  //Get latest row data
  const data = getLatestWeightData();
  const postMessage =　data.weightKg+"kg "+data.fatPercent+"%";
    
  //POST to Slack channel
  const baseURL = "https://slack.com/api/chat.postMessage";
  const postData = {
    "channel": "<your channel name>",
    "as_user": true,
    "text": postMessage
  };
  const options = {
    "method": "post",
    "contentType": "application/json; charset=utf-8",
    "headers":{
      "Authorization": "Bearer <!!your access token!!>"
    },
    "payload": JSON.stringify(postData)
  }
  
  const response = UrlFetchApp.fetch(baseURL, options);
  Logger.log(response)
  return
}
```
Slackグループの設定がありませんが、トークンがグループごとに発行されるのでそこで認識されています。  
`"as_user": true`を設定したので、あたかも自分が発言したかのようにチャンネルにポストされます。

![image](./post.PNG)

仲間内で牽制し合うコミュニティではIFTTTよりこちらのほうがより便利かと思います。  
他にも自動で有給連絡したり、`as_user`オプションの使い道は結構ありそうですね。

アプリ連携体重計だとその後の広がりがあまり良くないのですが、WEBサービスだと連携も簡単です。タニタもオムロンも、WEBサービス連携する体重計は結構高いので1万円程度で買えるWithingsはかなりコスパ良い買い物でした。

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/31owzwXkO%2BL._SL160_.jpg" alt="Withings Body + フランス生まれのスマート体重計 ブラック Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-BLACK-ALL-JP" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Withings Body + フランス生まれのスマート体重計 ブラック Wi-Fi/Bluetooth対応 体組成計 【日本正規代理店品】 WBS05-BLACK-ALL-JP</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 19.07.19</div></div><div class="amazlet-detail">Withings (2017-06-20)<br />売り上げランキング: 729<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/B071LNJTVH/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>