var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_demo_2", { useNewUrlParser: true });
var Post = require("./models/post");
var User = require("./models/user");


Post.create({
  title: "Syntagh gia biftekes noumero 3",
  content: "jfhdbtgbrtdakljfewfh"
}, function(err, post){
    if (err) {
        console.log(err);
    } else {
        User.findOne({name: "Boreli"}, function(err, foundUser){
          if (err) {
              console.log(err);
          } else {
              foundUser.posts.push(post);
              foundUser.save(function(err, data){
                  if (err) {
                      console.log(err);
                  } else {
                      console.log(data);
                  }
              });
          } 
        });
    }
});


//User.create({
//   email: "nai@borei.oxi",
//   name: "Boreli"
// });



//find user and find all the posts of that user
// User.findOne({name: "Boreli"}).populate("posts").exec(function(err, user){
//   if (err) {
//       console.log(err);
//   } else {
//       console.log(user);
//   } 
//});





