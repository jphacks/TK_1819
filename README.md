# ごみUp

[![Product Name](image.png)](https://www.youtube.com/watch?v=G5rULR53uMk)

## 製品概要
### ごみUp

### 背景（製品開発のきっかけ、課題等）
日本を訪れる海外旅行客が増えていますが、日本では、海外に比べてゴミ箱が少なく、ゴミが捨てずらいという問題があります。一方で、東京のポイ捨て事情も深刻です。さらに、東京五輪を控えており、これらの問題は増々深刻さを増すことが予想されます。
そこで、ごみUpはゴミ箱を見つけるまでの工程をHackすることで、ゴミ箱の捨てずらの軽減とゴミを捨てることの楽しさを向上させます。

### 製品説明（具体的な製品の説明）
ごみUpはゴミ箱に近づくとLINE BOTを通じて、そのことを知らせてくれます。

ゴミ箱にはLINE Beaconが設置されており、簡単なIoTデバイスも設置することができます。例えば、ゴミ箱にLEDを設置しておけば、ユーザが近づいたときにLEDを明滅させて、その位置をわかり安く示してくれます。

ゴミをゴミ箱に捨て、その写真をLINE BOTに送ることや、ゴミ箱がいっぱいになったことをLINE BOTを通じて知らせることで、ユーザにポイントが付与されます。ポイントの高いユーザは、ゴミ箱から大きな歓迎を受けるでしょう。

ごみUpはこれらの機能を通じて、ゴミの位置をわかりやすくしてくれるだけでなく、ゴミを捨てることを楽しく演出したり、ゴミ箱が満杯になったことをゴミ箱の管理者に知らせることができるので、ゴミを捨てやすくしてくれるだけでなく、環境美化にも貢献します。


### 特長
実社会の空間的な近さに着目し，これまでハードルの高かった，旅行先で現地の人の情報を活かすことができる．


#### 1. 特長1
地理×質問：　その場所の生きた回答が得られる

#### 2. 特長2


#### 3. 特長3

### サービスの流れ   

####  質問者の場合
#### 1.質問する
GuideManのLINE BOTで「質問する」ボタンを押し、質問を書いて送信、回答を待つ。
GuideManはこの質問を答えられる回答者を探し、通知する。

#### 2.回答候補を見る
GuideManの提示する回答者候補の中から気に入った回答者を選択。
回答者からの回答を待つ。

#### 3.回答に従う
回答者の対話方法がGuideManのLINE BOTに表示される。（「チャット」または「実際に会う」）

#### 4.回答者とチャットによって対話する場合
LINE BOTを介して対話する。（LINE BOTをお互いの会話をパイプする）
対話が終了次第、LINE BOTは「対話終了」ボタンを押す。

#### 4.回答者と実際に会って対話する場合
回答者が自分に近くに来るのを待つ。回答者が近くに来た時、合図のためのポーズがLINE BOTに表示される。待ち合わせが終了時、「待ち合わせ終了」ボタンを押し、回答者と対話を開始する。
対話が終了次第、LINE BOTで、「対話終了」ボタンを押す。

#### 5.対話が終了したら
回答者を評価する。（1~5）
体験を場所に残したい場合は体験をまとめる。（報酬額を決める）
サービス終了

#### 回答者の場合
#### 1.質問者を探す
「質問者を探す」ボタンを押し、GuideManが選択した質問を表示させる。

#### 2.質問を選択する
表示された質問の中から答える質問を選択する。

#### 3.質問への答え方を選択する
質問への答え方を「チャット」と「実際に会う」から選択する。

#### 4.回答者が質問を選択するのを待つ
回答者が自分の回答を選択されるのを待つ。
選択された場合、次の状態へ遷移。
選択されなかった場合、ここで、サービスが終了。

#### 5.質問者とチャットによって対話する場合
LINE BOTを介して対話する。（LINE BOTをお互いの会話をパイプする）
対話が終了次第、LINE BOTの「対話終了」ボタンを押す。

#### 5.質問者と実際に会って対話する場合
質問者のいる場所に向かう。（質問者のビーコンの場所が知らされる）
質問者のビーコンに入った時、合図のためのポーズがLINE BOTに表示される。待ち合わせが終了時、「待ち合わせ終了」ボタンを押し、質問者と対話を開始する。
対話が終了次第、LINE BOTの「対話終了」ボタンを押す。

#### 6.対話が終了したら
質問者を評価する。（1~5）
体験を場所に残したい場合は体験をまとめる。（報酬額を決める）
サービス終了

### 解決出来ること
この製品を利用することによって最終的に解決できることについて記載をしてください。

### 今後の展望
今回は実現できなかったが、今後改善すること、どのように展開していくことが可能かについて記載をしてください。


## 開発内容・開発技術
### 活用した技術
#### API・データ
今回スポンサーから提供されたAPI、製品などの外部技術があれば記述をして下さい。

* 
* 
* 

#### フレームワーク・ライブラリ・モジュール
* NODE.js
* LINE BOT

#### デバイス
* 
* 

### 研究内容・事前開発プロダクト（任意）
ご自身やチームの研究内容や、事前に持ち込みをしたプロダクトがある場合は、こちらに実績なども含め記載をして下さい。

* 
* 


### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください（任意）
