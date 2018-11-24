'use strict';

const line = require('@line/bot-sdk');
const HTTPError = require('@line/bot-sdk').HTTPError;
const line_middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const os = require('os');
const hostname = os.hostname();
const request = require('request');
const http = require('https');
const streamBuffers = require('stream-buffers');


const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
const client = new line.Client(config);

/**
 * Linebot.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all linebots.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('linebot', params);
    // Select field to populate.
    const populate = Linebot.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Linebot
      .find()
      .where(filters.where)
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Promise to fetch a/an linebot.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Linebot.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Linebot
      .findOne(_.pick(params, _.keys(Linebot.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count linebots.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('linebot', params);

    return Linebot
      .count()
      .where(filters.where);
  },

  /**
   * Promise to add a/an linebot.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Linebot.associations.map(ast => ast.alias));
    const data = _.omit(values, Linebot.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Linebot.create(data);

    // Create relational data and return the entry.
    return Linebot.updateRelations({ _id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an linebot.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Linebot.associations.map(a => a.alias));
    const data = _.omit(values, Linebot.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Linebot.update(params, data, { multi: true });

    // Update relational data and return the entry.
    return Linebot.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an linebot.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Linebot.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Linebot
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Linebot.associations.map(async association => {
        if (!association.via || !data._id) {
          return true;
        }

        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  },

  /**
   * Promise to search a/an linebot.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('linebot', params);
    // Select field to populate.
    const populate = Linebot.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    const $or = Object.keys(Linebot.attributes).reduce((acc, curr) => {
      switch (Linebot.attributes[curr].type) {
        case 'integer':
        case 'float':
        case 'decimal':
          if (!_.isNaN(_.toNumber(params._q))) {
            return acc.concat({ [curr]: params._q });
          }

          return acc;
        case 'string':
        case 'text':
        case 'password':
          return acc.concat({ [curr]: { $regex: params._q, $options: 'i' } });
        case 'boolean':
          if (params._q === 'true' || params._q === 'false') {
            return acc.concat({ [curr]: params._q === 'true' });
          }

          return acc;
        default:
          return acc;
      }
    }, []);

    return Linebot
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Route and handle each events.
   *
   * @return {resolve}
   */

  handleEvent: async (event) => {
    console.log("event === " + event);
    if (event.type == 'follow') {
      followHandler(event)
    } else if (event.type == 'beacon'){
      beaconHandler(event)
    } else if (event.type == 'message') {
      if (event.message.type == 'image') {
        imageHandler(event)
      } else {
        chatHandler(event)
      }
    }

    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    return 0
  }
};

// helper functions
/**
 * Register user.
 *
 * @return {int}
 */

const registerNewLineUser = async (userId) => {
  console.log("registration functionality here")
  await strapi.services.lineuser.add({"userID" : userId, "score" : 0})
}

/**
 * check user exist.
 *
 * @return {int}
 */

// Maybe creating async branch function is not ideal.
const isUserExist = async (userId) => {
  // .fetch() returns null if not exist
  const currentUser = await strapi.services.lineuser.fetch({"userID" : userId})
  // console.log("currentUser == " + currentUser)
  if (currentUser) {
    console.log(`User ${userId} already exist!!`)
    return true
  } else {
    console.log("User doesn't exist!!")
    return false 
  }
}

/**
 * Handle follow (& unfollow) events.
 *
 * @return {resolve}
 */

const followHandler = async (event) => {
  if (await isUserExist(event.source.userId)) {
    console.log("I was blocked...")
    client.pushMessage(event.source.userId, [{
      "text" : '再登録ありがとうございます！これからもゴミを捨てるお手伝いをいたします！',
      "type" : 'text'
    }]);
  } else {
    await registerNewLineUser(event.source.userId)
    client.pushMessage(event.source.userId, [{
      "text" : 'フォローありがとうございます！これからはゴミ捨てを忘れる心配はありません！',
      "type" : 'text'
    }]);
  }

}

/**
 * Handle beacon events.
 *
 * @return {resolve}
 */

const beaconHandler = async (event) => {
  // console.log("Beacon event detected")
  if (event.beacon.type === 'enter'){
    if (! await isUserExist(event.source.userId)) {
      console.log("User entered beacon doesn't exist!")
      await registerNewLineUser(event.source.userId)
    }
    // Should be better way to write this...
    const messagedUser = await strapi.services.lineuser.fetch({"userID": event.source.userId})
    let enteredTrashcan = await strapi.services.trashcan.fetch({"beaconID": event.beacon.hwid})
    console.log("enteredTrashcan === " + enteredTrashcan)
    // すでに登録されているかを調べる
    let dupIndex = -1
    for (let i = 0; i < enteredTrashcan.lineusers.length; i++) {
      if (enteredTrashcan.lineusers[i]._id.toString() == messagedUser._id.toString()) {
        dupIndex = i
        console.log("Found the duplicated user in trashcan index: " + dupIndex)
      }
    } 
    if (dupIndex < 0) {
      console.log("This user was not in this trashcan")
      // enteredTrashcanに，userを結びつける
      enteredTrashcan.lineusers.push(messagedUser)
      await strapi.services.trashcan.edit({"_id": enteredTrashcan._id}, {"lineusers": enteredTrashcan.lineusers})
    }

    client.pushMessage(event.source.userId, [ {
      type: 'template',
      altText: 'スマートフォンから確認してください',
      template: {
        type: 'buttons',
        title: 'お知らせ', // 40文字以内
        text: '近くに燃えるゴミ用のゴミ箱があります。ゴミはゴミ箱へ捨てましょう！捨てに行きますか？', // 60文字以内
        thumbnailImageUrl: "https://" + process.env.HOSTNAME + enteredTrashcan.thumbnail.url, // httpsのみ可
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
      address: enteredTrashcan.name,
      latitude: enteredTrashcan.location.latitude,
      longitude: enteredTrashcan.location.longitude
    }]
    );
  } else if (event.beacon.type === 'leave'){
    const messagedUser = await strapi.services.lineuser.fetch({"userID": event.source.userId})
    let leftTrashcan = await strapi.services.trashcan.fetch({"beaconID": event.beacon.hwid})
    // すでに登録されているかを調べる
    let dupIndex = -1
    for (let i = 0; i < leftTrashcan.lineusers.length; i++) {
      if (leftTrashcan.lineusers[i]._id.toString() == messagedUser._id.toString()) {
        dupIndex = i
        console.log("Found the user leaved trashcan at index: " + dupIndex)
      }
    } 
    if (dupIndex >= 0) {
      console.log("This user is in this trashcan")
      // enteredTrashcanに，userを結びつける
      leftTrashcan.lineusers.splice(dupIndex, 1)
      await strapi.services.trashcan.edit({"_id": leftTrashcan._id}, {"lineusers": leftTrashcan.lineusers})
    }
    // Exiting from zone
    client.pushMessage(event.source.userId, [{
      "text" : 'ばいばい',
      "type" : 'text'
    }]);
  }
}

/**
 * Handle image events.
 *
 * @return {resolve}
 */

// helper for await
function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(new Buffer(body));
      } else {
        reject(error);
      }
    });
  });
}


const imageHandler = async (event) => {
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
      // "Content-type": "application/json; charset=UTF-8",
      "Authorization": " Bearer " + config.channelAccessToken
    },
    method:'GET'
  };


  console.log("image message had been sent");
  // var req = http.request(send_options, function(res){
  //   var data = [];
  //   console.log("recieved the image");
  //   res.on('data', function(chunk){
  //     data.push(new Buffer(chunk));
  //   }).on('error', function(err){
  //     console.log(err);
  //   }).on('end', function(){
  //     console.log("finished recieving the image");
  //     console.log(strapi.config.url)
  //     let files = {}
  //     files.images = data
  //     if (strapi.plugins.upload && Object.keys(files).length > 0) {
  //       // Upload new files and attach them to this entity.
  //       await strapi.plugins.upload.services.upload.uploadToEntity({
  //         id: "5bf03a6b0c8ee12e4a869fce",
  //         model: Trashcan 
  //       }, files, source);
  //     }
  //     // getObjectName(data);
  //   });
  // });

  let image_buff = await doRequest(options)
  // let files = {}
  // files.images["File"] = image_buf 
  console.log(image_buf)
  // let files = image_buf 
  // files["path"] = '/tmp/tmp'
  // if (strapi.plugins.upload && Object.keys(files).length > 0) {
  //   // Upload new files and attach them to this entity.
  //   await strapi.plugins.upload.services.upload.uploadToEntity({
  //     id: "5bf03a6b0c8ee12e4a869fce",
  //     model: 'trashcan', 
  //   }, files, null);
  // }

  // Initialize stream
  var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
    frequency: 10,      // in milliseconds.
    chunkSize: 2048     // in bytes.
  }); 

  // With a buffer
  // myReadableStreamBuffer.put(Buffer.concat(image_buf));

  var formData = {
    // file: myReadableStreamBuffer,
    file: escape(image_buf).toString('binary'),
    // options:{
    //   contentType:req.file.mimetype,
    //   filename:"image.jpg"
    // }
  };

  var customVisionApiRequestOptions = {
    uri: "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/09776bb1-e376-4557-b2c1-49fc7700eeef/image?iterationId=6554a808-deca-4481-b833-e6f7895b58ed",
    headers: {
      "Content-Type": "multipart/form-data",
      "Prediction-Key": "1e6c252eef53454ab399198a722d7a6d"
    },
    // formData: escape(image_buf).toString('binary')
    // formData: formData
    // formData: myReadableStreamBuffer
  };
  customVisionApiRequestOptions['body'] = image_buff
  let tag = ""
  request.post(customVisionApiRequestOptions, function (error, response, body) {
    // 結果取得OKの場合
    console.log("image sent")
    console.log(response.statusMessage)
    if (!error && response.statusCode == 200) {
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
      if (tag == "garbagebox") {
        client.pushMessage(event.source.userId, [{
          "text" : 'ごみ箱の写真です！！',
          "type" : 'text'
        }])       
      } else {
        client.pushMessage(event.source.userId, [{
          "text" : 'ごみ箱以外の写真です....',
          "type" : 'text'
        }])
      }


      // 取得したタグに対応してメッセージをセット
      // メッセージ送信

      // 結果取得NGの場合
    } else {
      console.log("error: " + error);
    }
  });

}

const addScore = (currentScore, scoreNum) => {
  let score 
  score = currentScore + scoreNum;
  // if (currentScore > 5) {
  //   score = 0;
  // } else {
  //   score = currentScore + 1;
  // }
  return score 
}

const addFullCounter = (currentFullCounter) => {
  // console.log("this is currentfullcounter!!!" + currentFullCounter)
  let counter 
  counter = currentFullCounter + 1;
  // if (currentFullCounter > 3) {
  //   counter = 0;
  // } else {
  //   counter = currentFullCounter + 1;
  // }
  return counter 
}

/**
 * Handle chat events.
 *
 * @return {resolve}
 */

const chatHandler = async (event) => {
  if (! await isUserExist(event.source.userId)) {
    console.log("User messaged to the bot doesn't exist!")
    await registerNewLineUser(event.source.userId)
  } 
  let messagedUser = await strapi.services.lineuser.fetch({"userID": event.source.userId})
  let currentUserScore = messagedUser.score;
  
  if (event.message.text === 'ポイントは？') {
    client.pushMessage(event.source.userId, [{
      "text" : 'ありがとうございます！',
      "type" : 'text'
    },{
      "text" : 'あなたは現在' + currentUserScore + 'point保有しています。',
      "type" : 'text'
    }]
    )
  } else if (event.message.text === 'いっぱい') {
    if (messagedUser.trashcan._id) {
      let userTrashcan = await strapi.services.trashcan.fetch({"_id": messagedUser.trashcan._id}) 
      // fullCounterはここでしか使用しないからここで初めて引いてくる(userScoreとの非対称はそれが原因)
      const currentFullCounter = addFullCounter(userTrashcan.fullCounter)
      if (currentFullCounter >= 3) {
        console.log("It's actualy full!")
        try {
          // editの中身が変だとUnresolved promiseになる．
          await strapi.services.trashcan.edit({"_id": userTrashcan._id}, {"fullCounter": currentFullCounter, "isFull": true})
        } catch {
          console.log("isFull edit went wrong")       
        }
      } else {
        await strapi.services.trashcan.edit({"_id": userTrashcan._id}, {"fullCounter": currentFullCounter, "isFull": false})
        console.log("It's not full yet")
      }
    }
    try {
      messagedUser.score = addScore(currentUserScore, 3)
      await strapi.services.lineuser.edit({"_id": messagedUser._id}, {"score": messagedUser.score})
    } catch {
      console.log("score edit went wrong")
    }
    client.pushMessage(event.source.userId, [{
      "text" : 'ご報告ありがとうございます！',
      "type" : 'text'
    },{
      "text" : 'あなたは現在' + messagedUser.score + 'point保有しています。',
      "type" : 'text'
    }]
    )
  } else if (event.message.text === 'まだ大丈夫') {
    try {
      messagedUser.score = addScore(currentUserScore, 3)
      await strapi.services.lineuser.edit({"_id": messagedUser._id}, {"score": messagedUser.score})
    } catch {
      console.log("score edit went wrong")
    }
    client.pushMessage(event.source.userId, [{
      "text" : 'ご報告ありがとうございます！',
      "type" : 'text'
    },{
      "text" : 'あなたは現在' + messagedUser.score + 'point保有しています。',
      "type" : 'text'
    }]
    )
  } else if (event.message.text === 'はい') {
    // 捨てに行った場合
    if (messagedUser.trashcan._id) {
      let userTrashcan = await strapi.services.trashcan.fetch({"_id": messagedUser.trashcan._id}) 
      messagedUser.score = addScore(currentUserScore, 1)
      await strapi.services.lineuser.edit({"_id": messagedUser._id}, {"score": messagedUser.score})
      userTrashcan.requestState = messagedUser.score
      // console.log("messagedUser:: " + messagedUser)
      // console.log("user trashcan :: " + userTrashcan)
      // userIDからTrashcanを引いて，stateを変更する
      try {
        // editの中身が変だとUnresolved promiseになる．
        await strapi.services.trashcan.edit({"_id": userTrashcan._id}, {"requestState": userTrashcan.requestState})
        setTimeout(turnOffLamp, 10000, userTrashcan);
      } catch {
        console.log("edit function went wrong")       
      }
      // update user score in database
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
      )
    } else {
      console.log("This user doesn't belongs to any trashcan")    
      client.pushMessage(event.source.userId, [{
        "text" : '近くにごみ箱はありません！',
        "type" : 'text'
      }]
      )
    }
  } else {
    client.replyMessage(event.replyToken, {
      "text": event.message.text ,
      "type" : 'text'
    }).catch((err) => {
      if (err instanceof HTTPError) {
        console.error("Request ot Line server went wrong status code:" + err.statusCode);
      }
    });
  }
}

const turnOffLamp = (trashcan) => {
  trashcan.requestState = -1 
  strapi.services.trashcan.edit({"_id": trashcan._id}, {"requestState": trashcan.requestState})
}
