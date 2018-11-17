var request = require('request');
var fs = require('fs')

var formData = {
    file: fs.createReadStream('/Users/t_iwai/Downloads/209586510_624.jpg'),
};


var customVisionApiRequestOptions = {
    uri: process.env.CUSTOM_VISION_API_URI,
    headers: {
        "Content-Type": "application/json",
        "Prediction-Key": "1e6c252eef53454ab399198a722d7a6d"
    },
    formData: formData
};

request.post(customVisionApiRequestOptions, function (error, response, body) {
    // 結果取得OKの場合
    if (!error && response.statusCode == 200) {

        // food タグ および カテゴリーを取得
        if (response.body.predictions[0].tagName != "garbagebox") {
            if (response.body.predictions[0].probability > 0.5) {
                tag = "Negative";
            }
        } else {
            if (response.body.predictions[1].probability > 0.5) {
                tag = "garbagebox";
            }
        }

        // 取得したタグに対応してメッセージをセット
        // メッセージ送信

    // 結果取得NGの場合
    } else {
        console.log("error: " + error);
    }
});
