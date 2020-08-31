
const passport = require('passport');
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
//const httpServer = http.createServer(app);
const HTTPS_PORT = 8443;
//const PORT = process.env.PORT || 3000;
const PORT = 3000;
const https = require('https');
const fs = require('fs');
require('./config/passport')(passport);//used to access passport.js file in cnfig
require('./routes/index')(app,passport);//used to access index.js in routes //no need, all elements are included here

const serverConfig = {  //defining server configuration
    key: fs.readFileSync('key.pem'), //reading file key.pem
    cert: fs.readFileSync('cert.pem'),//reading file cert.pem
  };
  
  const httpsServer = https.createServer(serverConfig , app) // create server with cert, key, and app
   httpsServer.listen(HTTPS_PORT, function(){ //listen at 8443 port
      console.log("app is listening on", HTTPS_PORT)
    })

    const wsServer = new WebSocket.Server({ server: httpsServer});
                                  //clientTracking : true // Create a server for handling websocket calls
wsServer.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};
// array of connected websocket clients
let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});


