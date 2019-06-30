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

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");


//seedDB(); 
mongoose.connect("mongodb://localhost:27017/yelp_camp_v8", { useNewUrlParser: true });

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

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is ready!");
});