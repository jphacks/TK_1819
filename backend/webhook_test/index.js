const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed

const app = express()

let channelSecret_ENV = process.env.CHANNEL_SECRET;
let channelAccessToken_ENV = process.env.CHANNEL_ACCESSTOKEN;

var port = process.env.PORT || 1337;

const config = {
  channelAccessToken: channelAccessToken_ENV,
  channelSecret: channelSecret_ENV
}

app.use(middleware(config))

app.get('/', (req, res) => {
  res.send("Hello Azure!");
  console.log('hogegege')
})

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
  console.log('hoge')
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(port)