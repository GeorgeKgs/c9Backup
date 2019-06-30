var express = require("express");
var router  = express.Router();
var Bar     = require("../models/bar");
var Review  = require("../models/review");
var Comment = require("../models/comment");


// Index Route - Show all bars
router.get("/bars", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        Bar.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, searchBars){
            Bar.count({name: regex}).exec(function (err, count) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if (searchBars.length === 0) {
                        req.flash("error", "Sorry, no matches. Please try again");
                        return res.redirect("/bars");
                    }
                    res.render("bars/index", {
                        bars: searchBars,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: req.query.search,
                        page: "bars"
                    });
                  }
            });
        });
    } else {
    //Get all bars from db
        Bar.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, bars){
            Bar.count().exec(function (err, count) {
                if(err) {
                    console.log(err);
                } else {
                    res.render("bars/index", {
                        bars: bars,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: false,
                        page: "bars"
                    });
                  }
            });
        });
      }
});

// Create Route - Add new bar to Db
router.post("/bars", isLoggedIn, function(req, res){ //same path /bars --> REST convention
    //get data from form and add to the array
    var name   = req.body.name;            //what the name atr in new.ejs was set to
    var price  = req.body.price;           //what the name atr in new.ejs was set to
    var image  = req.body.image;           //what the name atr in new.ejs was set to 
    var desc   = req.body.description;     //what the name atr in new.ejs was set to
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newBar = {name: name, price: price, image: image, description: desc, author: author};
    //Create new bar and save it to the db
    Bar.create(newBar, function(err, newlyCreated){
       if (err) {
           console.log(err);
       } else {
           //redirect back to bars page
           res.redirect("/bars");
       }
    });
});

//New Route - Show form to create new bar
router.get("/bars/new", isLoggedIn, function(req, res){ 
    res.render("bars/new");
});

//Show Route - Shows more info about one bar
router.get("/bars/:id", function(req, res){ 
    //Find the bar with provided id
    Bar.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundBar){
       if (err) {
           console.log(err);
       } else {
           console.log(foundBar);
           //render show template with that bar
           res.render("bars/show", {bar: foundBar});
       }
    }); 
});

//Edit bar route (show edit form)
router.get("/bars/:id/edit", checkBarOwner, function(req, res){
        Bar.findById(req.params.id, function(err, foundBar){
            res.render("bars/edit", {bar: foundBar});
        });
});

//Update bar route
router.put("/bars/:id", checkBarOwner, function(req, res){
    delete req.body.bar.rating;
   //find and update the correct bar
   Bar.findByIdAndUpdate(req.params.id, req.body.bar, function(err, updatedBar){
      if (err) {
          res.redirect("/bars");
      } else {
          //redirect somewhere (show page)
          res.redirect("/bars/" + req.params.id);
      } 
   });
   
});

//Destroy bar route
router.delete("/bars/:id", checkBarOwner, function(req, res){
    Bar.findById(req.params.id, function(err, bar){
       if (err) {
           res.redirect("/bars");
       } else {
           //Delete all associated comments
           Comment.remove({"_id": {$in: bar.comments}}, function(err){
               if (err) {
                   console.log(err);
                   return res.redirect("/bars");
               }
               //Delete all associated reviews
               Review.remove({"_id": {$in: bar.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/bars");
                    }
                    // Delete the bar
                    bar.remove();
                    req.flash("success", "Bar deleted successfully!");
                    res.redirect("/bars");
                });
           });   
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

function checkBarOwner(req, res, next){
    //Is user logged in?
    if(req.isAuthenticated()){
        Bar.findById(req.params.id, function(err, foundBar){
            if (err) {
                req.flash("error", "Store not found!");
                res.redirect("back");
            }   else {
                //Does user own the bar?
                    if(foundBar.author.id.equals(req.user._id) || req.user.isAdmin){
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



//Function for search (regex)
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};





module.exports = router;