var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    password: String,
    email: String,
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false},
    mobile: Number,
    created: {type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);