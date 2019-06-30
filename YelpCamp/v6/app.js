var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var localStrategy = require("passport-local");
var Camp          = require("./models/camp");
var seedDB        = require("./seeds"); 
var Comment       = require("./models/comment");
var User          = require("./models/user");



seedDB(); 
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));  //tell express to use body-parser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//Passport Configuration==========

app.use(require("express-session")({
  secret: "Edw genika boroume na valoume oti theloume gia na ginei to code kai decode",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); //Tell express to use passport
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;// req.user will be either empty or contain the username and id of the current user
   next();
});

//====================
//Campground Routes
//====================


app.get("/", function(req, res){
    res.render("landing");
});

// Index Route - Show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){ //same path /campgrounds --> REST convention
    //get data from form and add to the array
    var name = req.body.name;          //what the name atr in new.ejs was set to
    var image = req.body.image;        //what the name atr in new.ejs was set to 
    var desc = req.body.description;   //what the name atr in new.ejs was set to
    var newCampground = {name: name, image: image, description: desc};
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
app.get("/campgrounds/new", function(req, res){ 
    res.render("campgrounds/new");
});

//Show Route - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){ 
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


//========================
//Comments Routes
//========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
   Camp.findById(req.params.id, function(err, campground){
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground}); 
       }
   });
   
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
    //create new comment
    //connect comment to campground
    //redirect to campground show page
});


//==============================
//Auth Routes
//==============================

//Show register form
app.get("/register", function(req, res){
    res.render("register");
});

//Handle register logic
app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if (err) {
           console.log(err);
           return res.render("register");
       } 
          passport.authenticate("local")(req, res, function(){
              res.redirect("/campgrounds");
          }); 
   });
});

//Show login form
app.get("/login", function(req, res){
   res.render("login"); 
});

//Handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});



//Logout Route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});






function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is ready!");
});