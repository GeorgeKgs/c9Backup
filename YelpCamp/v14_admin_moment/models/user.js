var mongoose      = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);// take the methods that come with that package (serialize-deserialize)
                                         // and add them to userSchema

var User = mongoose.model("User", userSchema);
module.exports = User;