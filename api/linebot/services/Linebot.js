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

  handleEvent: (event) => {
    console.log(event);
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
  await strapi.services.lineuser.add({"userId" : userId, "score" : 0})
}

/**
 * check user exist.
 *
 * @return {int}
 */

const isUserExist = async (userId) => {
  const currentUser = await Lineuser.find({"userId" : userId})
  console.log("huge" + currentUser.length)
  if (currentUser.length > 0) {
    console.log("User ${userId} already exist!!")
    return true
  } else {
    return false 
    console.log("User doesn't exist!!")
  }
}

/**
 * Handle follow (& unfollow) events.
 *
 * @return {resolve}
 */

const followHandler = async (event) => {
  if (isUserExist(event.source.userId)) {
    console.log("I was blocked...")
    client.pushMessage(event.source.userId, [{
      "text" : '再登録ありがとうございます！これからもゴミを捨てましょう！',
      "type" : 'text'
    }]);
  } else {
    registerNewLineUser(event.source.userId)
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

const beaconHandler = (event) => {
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

/**
 * Handle image events.
 *
 * @return {resolve}
 */

const imageHandler = (event) => {
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

/**
 * Handle chat events.
 *
 * @return {resolve}
 */

const chatHandler = (event) => {
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
          console.error("Request ot Line server went wrong status code:" + err.statusCode);
        }
      });
  }
}
