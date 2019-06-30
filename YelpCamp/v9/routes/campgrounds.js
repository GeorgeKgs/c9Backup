var express = require("express");
var router  = express.Router();
var Camp     = require("../models/camp");


// Index Route - Show all campgrounds
router.get("/campgrounds", function(req, res){
    //Get all camps from db
    Camp.find({}, function(err, camps){
       if(err) {
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds: camps});
       }
    });
});

// Create Route - Add new campground to Db
router.post("/campgrounds", isLoggedIn, function(req, res){ //same path /campgrounds --> REST convention
    //get data from form and add to the array
    var name   = req.body.name;          //what the name atr in new.ejs was set to
    var image  = req.body.image;        //what the name atr in new.ejs was set to 
    var desc   = req.body.description;   //what the name atr in new.ejs was set to
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image: image, description: desc, author: author};
    //Create new camground and save it to the db
    Camp.create(newCampground, function(err, newCamp){
       if (err) {
           console.log(err);
       } else {
           //redirect back to campgrounds page
           res.redirect("/campgrounds");
       }
    });
});

//New Route - Show form to create new campground
router.get("/campgrounds/new", isLoggedIn, function(req, res){ 
    res.render("campgrounds/new");
});

//Show Route - Shows more info about one campground
router.get("/campgrounds/:id", function(req, res){ 
    //Find the campground with provided id
    Camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
       if (err) {
           console.log(err);
       } else {
           console.log(foundCamp);
           //render show template with that campground
           res.render("campgrounds/show", {campground: foundCamp});
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