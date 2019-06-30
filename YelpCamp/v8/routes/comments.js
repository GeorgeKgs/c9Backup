var express  = require("express");
var router   = express.Router();// pass in {mergeParams: true} if we want to change the paths with app.use in app.js
var Camp     = require("../models/camp");
var Comment  = require("../models/comment");

//Comments New
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
   Camp.findById(req.params.id, function(err, campground){
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground}); 
       }
   });
   
});

//Comments Create
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //Look up campground using id
    Camp.findById(req.params.id, function(err, campground){
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if (err) {
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save the comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              } 
           });
       } 
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


module.exports = router;