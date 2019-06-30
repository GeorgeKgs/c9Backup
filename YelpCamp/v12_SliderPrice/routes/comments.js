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
                  req.flash("error", "Something went wrong");
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save the comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Comment added!");
                  res.redirect("/campgrounds/" + campground._id);
              } 
           });
       } 
    });
});

//Comments edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if (err) {
           res.redirect("back");
       } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
       } 
    });
  
});

//Comment update route
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwner, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//Comment delete route
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       } 
    });
});







//Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

function checkCommentOwner(req, res, next){
    //Is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            }   else {
                //Does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){
                       next();
                    } else {
                        req.flash("error", "You dont have permission");
                        res.redirect("back");
                      }
                }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
      }
};








module.exports = router;