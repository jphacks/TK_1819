var lb = require('line-messaging');

var app = require('express')();
let channelID_ENV = process.env.CHANNEL_ID;
let channelSecret_ENV = process.env.CHANNEL_SECRET;
let channelAccessToken_ENV = process.env.CHANNEL_ACCESSTOKEN;

var bot = lb.Client({
    channelID: channelID_ENV,
    channelSecret: channelSecret_ENV,
    channelAccessToken: channelAccessToken_ENV
});
app.use(bot.webhook('/webhook'));
bot.on(lb.Events.MESSAGE, function(replyToken, message){
        console.log("piyo");
    bot.replyTextMessage(replyToken, 'hello world!').then(function (data) {
        console.log("hoge");
    }).catch(function(error){
        
    });
});
app.listen(443);