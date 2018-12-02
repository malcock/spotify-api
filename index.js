const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const dotenv = require('dotenv').config()
// const cookieParser = require('cookie-parser');



var app = express()

app.use(cors())


app.get('/login', function(req,res){
  var code = req.query.code
  var redirect_uri = "http://localhost:8080"
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(process.env.APP_ID + ':' + process.env.APP_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
            refresh_token = body.refresh_token;
      res.json({
        accessToken: access_token,
        refreshToken: refresh_token
      })
    }
  })
})

app.get('/refresh',function(req,res){
  var refresh_token = req.query.refreshToken;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.APP_ID + ':' + process.env.APP_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.json({
        accessToken: access_token,
        refreshToken:refresh_token
      });
    }
  });
})

console.log('Listening on 8888');
app.listen(8888);