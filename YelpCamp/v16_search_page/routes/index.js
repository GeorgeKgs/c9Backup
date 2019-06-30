var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");
var Campground = require("../models/camp");

//Root Route
router.get("/", function(req, res){
    res.render("landing");
});


//Show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

//Handle register logic
router.post("/register", function(req, res){
   var newUser = new User({
       username: req.body.username,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       email: req.body.email,
       profilepic: req.body.profilepic
   }); 
   console.log(newUser);
   if(req.body.adminPass === "password"){
     newUser.isAdmin = true;  
   };
   User.register(newUser, req.body.password, function(err, user){
        if (err) {
           console.log(err);
           return res.render("register", {error: err.message});
        } 
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome! " + user.username);
                res.redirect("/campgrounds");
            }); 
   });
});

//Show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//Handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

//Logout Route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("error", "Logged you out");
   res.redirect("/campgrounds");
});


// User Profile
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
      if (err) {
          req.flash("error", "User not found");
          return res.redirect("/campgrounds");
      }
      Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
         res.render("users/show", {user: foundUser, campgrounds: campgrounds});
      });  
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