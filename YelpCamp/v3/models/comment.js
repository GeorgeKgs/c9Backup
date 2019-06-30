var mongoose   = require("mongoose");

//Schema setup
var commentSchema = new mongoose.Schema({
   text: String,
   author: String,
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;