'use strict';

var express = require('express');
var app = express();
var fs = require("fs");
var moment = require("moment");

app.use(express.json({
  limit: '50mb'
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/', function(request, response){
  response.send("It works");
});

app.post('/api/photos', function (request, response) {
  let body = request.body;

  if (!body.photo) {
    response.send({
      ok: false,
      error: "No image"
    });
    return;
  }

  if (!body.driver) {
    response.send({
      ok: false,
      error: "No driver name/id"
    });
    return;
  }

  if (!body.location) {
    response.send({
      ok: false,
      error: "No location"
    });
    return;
  }

  const dir = moment().format("YYYY-MM-DD");
  if (!fs.existsSync(`${__dirname}/${dir}`))
    fs.mkdirSync(`${__dirname}/${dir}`);

  var imageBuffer = decodeBase64Image(request.body.photo);
  fs.writeFile(
    `${__dirname}/${dir}/${Date.now()}_${request.body.driver}_${request.body.location}.jpg`,
    imageBuffer.data,
    function (err) {
      if (err != null) {
        console.log(err);

        response.send({
          ok: false,
          error: err
        });
      }
    });

  response.send({
    ok: true
  });
});

app.listen(8080, ()=>{
  console.log(`App listening`);
});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3)
    return new Error('Invalid input string');

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], 'base64');

  return response;
}