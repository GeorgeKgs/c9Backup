var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/cat_app");
mongoose.connect('mongodb://localhost:27017/cat_app', { useNewUrlParser: true });

var catSchema = new mongoose.Schema({
   name: String,
   age: Number,
   temp: String
});

var Cat = mongoose.model("Cat", catSchema);

//Add new

// var gatoulhs = new Cat({
//   name: "Psipsinel",
//   age: 45,
//   temp: "Karxia"
// });
// gatoulhs.save(function(err, cat){
//     if (err) {
//         console.log("Something went wrong!");
//     } else {
//         console.log("Cat saved!");
//         console.log(cat);//george is what we have in js and try to save in the db and cat is what is sent back from the db
//     }
// });

Cat.create({
   name: "Burito",
   age: 80,
   temp: "gerontas"
}, function(err, cat){
    if (err) {
        console.log(err);
    } else {
        console.log(cat);
    }
});




// Retrieve all
Cat.find({}, function(err, cats){
   if (err) {
       console.log("ERROR");
       console.log(err);
   } else {
       console.log("All the cats..");
       console.log(cats);
   }
});