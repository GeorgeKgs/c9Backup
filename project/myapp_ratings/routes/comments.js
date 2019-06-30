var express = require("express");
var router  = express.Router();// pass in {mergeParams: true} if we want to change the paths with app.use in app.js
var Bar     = require("../models/bar");
var Comment = require("../models/comment");

//Comments New
router.get("/bars/:id/comments/new", isLoggedIn, function(req, res){
   Bar.findById(req.params.id, function(err, bar){
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {bar: bar}); 
       }
   });
   
});

//Comments Create
router.post("/bars/:id/comments", isLoggedIn, function(req, res){
    //Look up bar using id
    Bar.findById(req.params.id, function(err, bar){
       if (err) {
           console.log(err);
           res.redirect("/bars");
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
                  bar.comments.push(comment);
                  bar.save();
                  req.flash("success", "Comment added!");
                  res.redirect("/bars/" + bar._id);
              } 
           });
       } 
    });
});

//Comments edit route
router.get("/bars/:id/comments/:comment_id/edit", checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if (err) {
           res.redirect("back");
       } else {
            res.render("comments/edit", {bar_id: req.params.id, comment: foundComment}); 
       } 
    });
  
});

//Comment update route
router.put("/bars/:id/comments/:comment_id", checkCommentOwner, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/bars/" + req.params.id);
       }
   }); 
});

//Comment delete route
router.delete("/bars/:id/comments/:comment_id", checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/bars/" + req.params.id);
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
                    if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
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