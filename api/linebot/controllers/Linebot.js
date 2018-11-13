'use strict';

const line = require('@line/bot-sdk');
const line_middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const os = require('os');
const hostname = os.hostname();
const request = require('request');
const http = require('https');

const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
const client = new line.Client(config);


/**
 * Linebot.js controller
 *
 * @description: A set of functions called "actions" for managing `Linebot`.
 */

module.exports = {

  /**
   * Retrieve linebot records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.linebot.search(ctx.query);
    } else {
      return strapi.services.linebot.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a linebot record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.linebot.fetch(ctx.params);
  },

  /**
   * Retrieve a linebot record.
   *
   * @return {Object}
   */

  webhook: async (ctx) => {
    console.log(ctx.request.body);

    Promise
      .all(ctx.request.body.events.map(handleEvent))
      .catch(function (err) {
        console.log("before then");
        console.log(err);
      })
      .then((result) => ctx.response.body = result)
      .catch(function (err) {
        console.log( "Something bad happens in webhook call");
        console.log(err);
        process.exit(1);
      });

    return strapi.services.linebot.fetch(ctx.params);
  },

  /**
   * Count linebot records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.linebot.count(ctx.query);
  },

  /**
   * Create a/an linebot record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.linebot.add(ctx.request.body);
  },

  /**
   * Update a/an linebot record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.linebot.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an linebot record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.linebot.remove(ctx.params);
  }
};

function handleEvent(event) {
  if(event.beacon){
    if (event.beacon.type === 'enter'){
      if (user_hash[event.source.userId] == undefined) {
        user_hash[event.source.userId] = {}
        user_hash[event.source.userId]["areaID"] = "";
        user_hash[event.source.userId]["level"] = 0;
      }
      user_hash[event.source.userId]["areaID"] = event.beacon.hwid;

      client.pushMessage(event.source.userId, [ {
        type: 'template',
        altText: 'スマートフォンから確認してください',
        template: {
          type: 'buttons',
          title: 'お知らせ', // 40文字以内
          text: '近くに燃えるゴミ用のゴミ箱があります。ゴミはゴミ箱へ捨てましょう！捨てに行きますか？', // 60文字以内
          thumbnailImageUrl: img_url, // httpsのみ可
          actions: [{
            type: 'message',
            label: 'はい',
            text: 'はい'
          }, {
            type: 'message',
            label: 'いいえ',
            text: 'いいえ'
          }]
        }
      }, {
        type: 'location',
        title: 'ここにあります。',
        address: '東京大学本郷キャンパス工学部２号館',
        latitude: 35.7144598,
        longitude: 139.7620094
      }]
      );
    } else if (event.beacon.type === 'leave'){
      user_hash[event.source.userId]["areaID"] = "";
      // Exiting from zone
      client.pushMessage(event.source.userId, [{
        "text" : 'ばいばい',
        "type" : 'text'
      }]);
    }
  }

  if (event.message.type != undefined && event.message.type == 'image') {
    let image_buf;
    const options = {
      url: `https://api.line.me/v2/bot/message/${event.message.id}/content`,
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + config.channelAccessToken,
      },
      encoding: null
    };
    const send_options = {
        host: 'api.line.me',
        path: `/v2/bot/message/${event.message.id}/content`,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": " Bearer " + config.channelAccessToken
        },
        method:'GET'
    };

    console.log("image message has been sent");
    var req = http.request(send_options, function(res){
      var data = [];

      console.log("recieved the image");
      res.on('data', function(chunk){
        data.push(new Buffer(chunk));
      }).on('error', function(err){
        console.log(err);
      }).on('end', function(){
        console.log("finished recieving the image");
        getObjectName(data);
      });
    });
    // request(options, function(error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     // image_buf = body
    //     image_buf = new Buffer(body)
    //     console.log('file recieved');
    //     getObjectName(image_buf.toString('binary'));
    //   } else {
    //     console.log(error);
    //     process.exit(1);
    //   }
    // });

  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }


  if (event.message.text === 'いっぱい' || event.message.text === 'まだ大丈夫' || event.message.text === 'ポイントは？') {
    // level++;
    client.pushMessage(event.source.userId, [{
      "text" : 'ありがとうございます！',
      "type" : 'text'
    },{
      "text" : 'あなたは'+ user_hash[event.source.userId]["level"] + 'pointあります。',
      "type" : 'text'
    }]
  );

    setTimeout(myFunc, 3000);

  } else if (event.message.text === 'はい') {
    can_flag = "1";
    let cur_user_level = user_hash[event.source.userId]["level"];
    if (cur_user_level > 5) {
      user_hash[event.source.userId]["level"] = 0;
    } else {
      user_hash[event.source.userId]["level"] = cur_user_level + 1;
    }
    client.pushMessage(event.source.userId, [{
      "type": "template",
      "altText": "ゴミ箱はいっぱいでしたか？",
      "template": {
          "type": "confirm",
          "text": "ゴミ箱はいっぱいでしたか？",
          "actions": [
              {
                "type": "message",
                "label": "いっぱい",
                "text": "いっぱい"
              },
              {
                "type": "message",
                "label": "まだ大丈夫",
                "text": "まだ大丈夫"
              }
          ]
        }
      }]
    );

    can_flag = "1";
    setTimeout(myFunc, 3000);
  } else {
    client.replyMessage(event.replyToken, {
      "text": event.message.text ,
      "type" : 'text'
      }
    )
    .catch((err) => {
      if (err instanceof HTTPError) {
        console.error(err.statusCode);
      }
    });
  }
  return 0
}
