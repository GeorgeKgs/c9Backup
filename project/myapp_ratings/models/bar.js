var mongoose   = require("mongoose");

//Schema setup
var barSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   createdAt: { type: Date, default: Date.now },
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
   ],
   reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

var Bar = mongoose.model("Bar", barSchema);
module.exports = Bar;