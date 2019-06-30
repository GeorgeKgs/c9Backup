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