#!/usr/bin/env node
var showServer = require('showserver');
var port = process.env.PORT || 8080;
//Will serve via http
showServer.start(port,false);

