#!/usr/bin/env node
/**
 * Module dependencies.
 */
const express = require('express');
const serveStatic = require('serve-static')
const path = require('path');
const fs = require('fs');
var defaultTTL = "300";
var bodyParser = require('body-parser');
process.env.PWD = process.cwd()


const EdgeAuth = require('akamai-edgeauth')
//const http = require('http') // Module for the test

var EA_ENCRYPTION_KEY = 'c0f462ec571c5b94371694c118583614c45f9252622732dc621d6e309d17b9aa'
var DURATION = 31622400 // year in seconds

// EdgeAuth for Query string
var ea = new EdgeAuth({
    key: EA_ENCRYPTION_KEY,
    windowSeconds: DURATION,
    escapeEarly: false,
    tokenName: "itoken"
});


//instantiate an express object
const app = express();

//define how to handle static requests
var staticOptions = {
  dotfiles: 'ignore',
  etag: true,
  index: false,
  lastModified: true,
  maxAge: '2h',
  setHeaders: function (res, path, stat) {
    console.log("path:"+path);
    //console.log("req:"+req.url);
    res.set('x-timestamp', Date.now())
  }
}


// Serve Test Image.
app.use('/images', express.static(process.env.PWD + '/public'));
//app.use('/13879666', express.static(process.env.PWD + '/public/images'));

//needs to be set before any app.use path match:
app.use(function (req, res, next) {
  console.log('Time: %d', Date.now());
  var url = JSON.stringify(req.url, null, 4);
  var headers = JSON.stringify(req.headers, null, 4);
  var requestDetails = url+"\n"+headers;

  //Compute EdgeAuth Token
  var requestURL = req.url;
  var token = ea.generateURLToken(requestURL)
  var edgeAuthUrlPath = `${requestURL}&${ea.options.tokenName}=${token}`;
  console.log("edgeAuthUrlPath:"+edgeAuthUrlPath);
  console.log("Request Header:"+requestDetails);
  next();
});

app.use(serveStatic(path.join(__dirname, 'public'), staticOptions));


//GET Request Handler
// app.get('/*', (req, res) => {
//   var url = JSON.stringify(req.url, null, 4);
//   var headers = JSON.stringify(req.headers, null, 4);
//   var requestDetails = url+"\n"+headers;
//   console.log("Request Header:"+requestDetails);
//   console.log("Response Header:"+JSON.stringify(res.header()._headers, null, 4))
//   res.send(requestDetails+"\n"+JSON.stringify(res.header()._headers, null, 4));
// })


const http = require("http");
const server = http.createServer(app);
//Start Server
const port = process.env.PORT || 8080;
console.log("port:"+port);
server.listen(port);
