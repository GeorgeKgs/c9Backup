var express = require("express");
var app = express();
app.use(express.static("public"));

app.get("/", function(req, res){
   res.render("home.ejs");
});

app.get("/fallinlovewith/:thing", function(req, res){
   var thing = req.params.thing;
   res.render("love.ejs", {thingVar: thing});
});

app.get("/posts", function(req, res){
   var posts = [
      {title: "post 1", author: "enas"},
      {title: "allo ena postaki", author: "marika"},
      {title: "postaki number 3", author: "menios"}
   ];
      
   res.render("posts.ejs", {posts: posts});      
});















app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Now serving your app!"); 
});