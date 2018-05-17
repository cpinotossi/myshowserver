exports.start = function(httpPort, httpsPort){
  /**
   * Module dependencies.
   */
  const express = require('express')
  var bodyParser = require('body-parser');
  var multer = require('multer'); // v1.0.5

  //instantiate multer object
  var upload = multer(); // for parsing multipart/form-data
  //instantiate an express object
  const app = express()

  //read keys from filesystem for https
  var fs = require('fs'),
      https = require('https'),
      http = require("http");
  var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  var credentials = {key: privateKey, cert: certificate};

  //GET Request Handler
  app.get('/*', (req, res) => {
    var url = JSON.stringify(req.url, null, 4);
    var headers = JSON.stringify(req.headers, null, 4);
    var response = url+"\n"+headers;
    console.log(response)
    res.send(response);
  })

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  //POST Request Handler
  app.post('/*', upload.array(), (req, res, next) => {
      var url = JSON.stringify(req.url, null, 4);
      var headers = JSON.stringify(req.headers, null, 4);
      var body = JSON.stringify(req.body, null, 4);
      var response = url+"\n"+headers+"\n"+body;
      console.log(response)
      res.send(response);
  });

  var httpServer = http.createServer(app);
  var httpsServer = https.createServer(credentials, app);
  //Start Server
  var httpPort = httpPort || 80;
  var httpsPort = httpsPort || 443;
  httpServer.listen(httpPort);
  httpsServer.listen(httpsPort);
};
