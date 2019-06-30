var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var passport       = require("passport");
var localStrategy  = require("passport-local");
var Bar           = require("./models/bar");
var Comment        = require("./models/comment");
var User           = require("./models/user");
var methodOverride = require("method-override");
var flash          = require("connect-flash");

var barRoutes     = require("./routes/bars");
var commentRoutes = require("./routes/comments");
var indexRoutes   = require("./routes/index");
var reviewRoutes  = require("./routes/reviews");



mongoose.connect("mongodb://localhost:27017/barshow", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));  //tell express to use body-parser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require("moment");

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
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(barRoutes);
app.use(commentRoutes);
app.use("/bars/:id/reviews", reviewRoutes);





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your server is ready!");
});