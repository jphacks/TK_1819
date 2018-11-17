var request = require('request');
var fs = require('fs')

var formData = {
    file: fs.createReadStream('/path/to/image'),
};


var customVisionApiRequestOptions = {
    uri: "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/09776bb1-e376-4557-b2c1-49fc7700eeef/image?iterationId=6554a808-deca-4481-b833-e6f7895b58ed",
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
        if (JSON.parse(response.body).predictions[0].tagName != "garbagebox") {
            if (JSON.parse(response.body).predictions[0].probability > 0.5) {
                tag = "Negative";
            }
        } else {
            if (JSON.parse(response.body).predictions[1].probability > 0.5) {
                tag = "garbagebox";
            }
        }
        console.log(tag)
        // 取得したタグに対応してメッセージをセット
        // メッセージ送信

    // 結果取得NGの場合
    } else {
        console.log("error: " + error);
    }
});
