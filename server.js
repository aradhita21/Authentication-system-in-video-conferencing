//app secret : 5d65535f4ecb09f523398aef9f8137c0
//App ID: 2284950575134905
const express = require('express'); //to create express app
const exphbs = require('express-handlebars'); //to use handlebars with express
const mongoose = require('mongoose');//mongoDB object
const app = express();//creates a new express application as app
const passport = require('passport'); //for authentication
const flash = require('connect-flash');//provide flash middleware
const morgan = require('morgan'); //morgan logger middleware
const cookieParser = require('cookie-parser');// enabling cookieParser middleware for flash messages
const bodyParser = require('body-parser');//parse the request body for authentication
const session = require('express-session');// enabling session middleware for flash messages
var config = require('./config/oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;

const HTTPS_PORT = 8443; //default port for http is 80
var CLIENTS = [];
var CLIENTS1 = [];
const fs = require('fs');//file system to sync files
const http = require('http'); //for http request
const https = require('https');//for https request
const WebSocket = require('ws'); // for websocket

const WebSocketServer = WebSocket.Server; // handle Web Socket events and actions
// Yes, TLS is required
//dotenv package and injects it into our project configuration
require('dotenv').config(); //require and configure dotenv
app.engine('handlebars',exphbs({defaultLayout : 'main'}));//express engine, layout=main.handlebars
app.set('view engine','handlebars');//engine is viewed as handlebars

app.use(flash());//for requesting flash error
app.use(morgan('dev')); //using logger
app.use(cookieParser()); //use cookies
app.use(bodyParser.urlencoded({ extended: true })); //parse url request
app.use(bodyParser.json())//parse json requests
//app.use(express.static('static'))

//process.env now has the keys and values you defined in your .env file.
const MONGODB_URI = process.env.MONGODB_URL; //to access our database
mongoose.connect(MONGODB_URI,{ useNewUrlParser : true });//connect mongoose with database
var db = mongoose.connection;//db = database connection
db.on('error', console.error.bind(console, 'connection error:')); //error if not connected
db.once('open', function() { // if MongoDB open
    console.log('connected'); //display connected
});

app.use(session({secret : 'ilearnnodejs'}));//initialise session  for cookie handling
app.use(passport.initialize());//initiaalise passport authentication for our app
app.use(passport.session());//initialise passport session for app
app.use(flash()); //for using flash messages


app.use("/static", express.static('./static/'));//used to access webrtc.js file in static folder
require('./config/passport')(passport);//used to access passport.js file in cnfig
require('./routes/index')(app,passport);//used to access index.js in routes //no need, all elements are included here

const serverConfig = {  //defining server configuration
 // key: fs.readFileSync('key.pem'), //reading file key.pem
 // cert: fs.readFileSync('cert.pem'),//reading file cert.pem
 key: fs.readFileSync('myKey.pem'), //reading file key.pem
  cert: fs.readFileSync('cert.crt'),//reading file cert.pem
  csr : fs.readFileSync('csr.pem'),
};

const httpsServer = https.createServer(serverConfig , app) // create server with cert, key, and app
 httpsServer.listen(HTTPS_PORT, function(){ //listen at 8443 port
    console.log("app is listening on", HTTPS_PORT)
  })
//////// videoconference
// Render the single client html file for any request the HTTP server receives
// Create a server for handling websocket calls
const wss = new WebSocketServer({ server: httpsServer });
///on the connection
streamer = [];
clientt = [];
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    var signal = JSON.parse(message);
    //console.log(signal)

    if (signal.source == 'fromstreamer'){
      streamer.push(signal);
    wss.streamBroadcast(message);}
    else if (signal.source == 'fromclient') {
     clientt.push(signal);
      wss.clientBroadcast(message);}

  })
  ws.on('error', () => ws.terminate());
});

wss.streamBroadcast = function (data) {
  //this.clients.forEach(function (client) { 
for(var i = 0; i<clientt.length; i++) {
  client = clientt[i]
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      console.log('streamer data sent');
    }
  };
};

wss.clientBroadcast = function (data) {
     // client = streamer;
     // console.log(streamer)
     this.clients.forEach(function (client) { 
        
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      console.log('client data sent');
    } })

};

console.log('Server running.');

// ----------------------------------------------------------------------------------------
//https://www.facebook.com/v2.2/dialog/oauth?response_type=code&redirect_uri=https%3A%2F%2F127.0.0.1%3A8443%2Fauth%2Ffacebook%2Fcallback&client_id=2284950575134905
