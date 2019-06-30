var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));  //tell express to use body-parser
app.set("view engine", "ejs");

//Schema setup
var campSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String 
});

var Camp = mongoose.model("Camp", campSchema);

// Camp.create({
//     name: "Ena Allo Meros",
//     image: "https://cdn.pixabay.com/photo/2016/11/21/16/02/bar-1846137__340.jpg",
//     description: "Pollan kalo magazaki pane mono ta poly kala paidakia"
// }, function(err, camp){
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("New camp:");
//         console.log(camp);
//     }
// });





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
            res.render("index", {campgrounds: camps});
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
    res.render("new");
});

//Show Route - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){ 
    //Find the campground with provided id
    Camp.findById(req.params.id, function(err, foundCamp){
       if (err) {
           console.log(err);
       } else {
           //render show template with that campground
           res.render("show", {campground: foundCamp});
       }
    });
    
    
});












app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is ready!");
});