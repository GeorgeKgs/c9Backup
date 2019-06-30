var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_demo", { useNewUrlParser: true });


//Post - title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);




//User - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema] //embedded data
});
var User = mongoose.model("User", userSchema);





// var newUser = new User({
//     email: "keftedakias@taverna.fgh",
//     name: "kwstas keftedhs"
// });

// newUser.posts.push({
//   title: "egw eimai",
//   content: "dokimastikos swlhnas"
// });

// newUser.save(function(err, user){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });



// var newPost = new Post({
//     title: "rgrg",
//     content: "postame"
// });
// newPost.save(function(err, post){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });



User.findOne({name: "kwstas keftedhs"}, function(err, user){
   if (err) {
       console.log(err);
   } else {
       user.posts.push({
          title: "allo ena post",
          content: "pakistanoiiii"
       });
       user.save(function(err, user){
          if (err) {
              console.log(err);
          } else {
              console.log(user);
          } 
       });
   } 
});