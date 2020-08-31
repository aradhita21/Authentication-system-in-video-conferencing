Local Authentication system and OAuth 2.0 Authentication system using Facebook social media 
=========================

The signaling server uses Node.js and `ws` and mongoDB for database and can be started as 
follows:

```
$ npm install
$ npm start
```
The following steps after running server are
```
With the server running, open Chrome and go to to `https://localhost:8443` from any client on the LAN.
Click on signup for creating an account, which will be stored in mongoDB data base in server side.
If already account is created, click on sign in to account
If signup using social media, click on FB link, and give permission for app to access your information.
```

This authentication system for signup and login requests using local login and signup strategy of passport.js , express, mongoose and OAuth2 implementation for FB login using facebook login strategy.
