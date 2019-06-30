var mongoose   = require("mongoose");

//Schema setup
var campSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String, 
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment" //model name
       }
   ]
});

var Camp = mongoose.model("Camp", campSchema);
module.exports = Camp;