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
    var name   = req.body.name;            //what the name atr in new.ejs was set to
    var price  = req.body.price;           //what the name atr in new.ejs was set to
    var image  = req.body.image;           //what the name atr in new.ejs was set to 
    var desc   = req.body.description;     //what the name atr in new.ejs was set to
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
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

//Edit campground route (show edit form)
router.get("/campgrounds/:id/edit", checkCampOwner, function(req, res){
        Camp.findById(req.params.id, function(err, foundCamp){
            res.render("campgrounds/edit", {campground: foundCamp});
        });
});

//Update campground route
router.put("/campgrounds/:id", checkCampOwner, function(req, res){
   //find and update the correct campground
   Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
      if (err) {
          res.redirect("/campgrounds");
      } else {
          //redirect somewhere (show page)
          res.redirect("/campgrounds/" + req.params.id);
      } 
   });
   
});

//Destroy campground route
router.delete("/campgrounds/:id", checkCampOwner, function(req, res){
    Camp.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
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

function checkCampOwner(req, res, next){
    //Is user logged in?
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }   else {
                //Does user own the campground?
                    if(foundCamp.author.id.equals(req.user._id)){
                       next();
                    } else {
                        req.flash("error", "You dont have permission to do that"); 
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