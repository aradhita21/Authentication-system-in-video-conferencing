const mongoose = require('mongoose');//library for interacting with mongodb
const  bcrypt   = require('bcrypt-nodejs');//library for hashing passwords
const Schema = mongoose.Schema;//array of obejct and schemas

let userschema = new Schema({ // storing user details

    local : { email : String, password : String },
   // email : { type: String, required: true, unique: true }, //store email as string, should be unique
  //  password : { type: String, required: true }, //store password as string, no need of unique
 //  registeredAt: { type: Date, index: true }// for maintaining data
        facebook : {
        id : String,
        token : String,
        email : String,
        name : String
    },

});

var tokenSchema = mongoose.Schema({
    value : String,
    user : { type : Schema.Types.ObjectId, ref : 'User'},
    expireAt : {  type : Date, expires : 60, default : Date.now }})
//generating hash of the password to be stored in database using bcrypt 
userschema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid, by somparing input password and the password stored
userschema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
let User = mongoose.model('User',userschema); //to access user's data from mongoDB
module.exports = User; //export User to be used in passport.js

