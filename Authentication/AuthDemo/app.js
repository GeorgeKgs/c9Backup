var express       = require("express");
var mongoose      = require("mongoose");
var passport      = require("passport");
var bodyParser    = require("body-parser");
var localStrategy = require("passport-local");
var User          = require("./models/user");
var session       = require("express-session");
var passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost:27017/auth_app", { useNewUrlParser: true });



var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "Edw genika boroume na valoume oti theloume gia na ginei to code kai decode",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize()); //Tell express to use passport
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));//we are creating a new local strategy using the User.authenticate
                                                     //method that is comming from passportLocalMongoose in the user file

passport.serializeUser(User.serializeUser());// encode and put the data back to the session     (defined on the user file)
passport.deserializeUser(User.deserializeUser());// unencode the data from session


//==================
//ROUTES
//==================

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});


//Auth Routes=====

//Show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if (err) {
           console.log("err");
       } else {
           passport.authenticate("local")(req, res, function(){
              res.redirect("/secret"); 
           });
       } 
    });
});

//Login Routes======

//Show login form
app.get("/login", function(req, res){
    res.render("login");
});


//Login logic
//Middleware : some code that runs before our final route callback
app.post("/login", passport.authenticate("local", {
   successRedirect: "/secret",
   failureRedirect: "/login"
}), function(req, res){
    
});

//Logout
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

















app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
});