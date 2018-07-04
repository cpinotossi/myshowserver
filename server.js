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
    res.set('x-timestamp', Date.now())
  }
}


// Serve Test Image.
app.use('/images', express.static(__dirname + '/public'));

//needs to be set before any app.use path match:
app.use(function (req, res, next) {
  console.log('Time: %d', Date.now());
  var url = JSON.stringify(req.url, null, 4);
  var headers = JSON.stringify(req.headers, null, 4);
  var requestDetails = url+"\n"+headers;
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
server.listen(port);
