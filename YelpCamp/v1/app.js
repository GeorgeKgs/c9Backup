var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));  //tell express to use body-parser
app.set("view engine", "ejs");

var campgrounds = [
        {name: "Ena Meros", image: "https://cdn.pixabay.com/photo/2018/07/14/15/27/cafe-3537801__340.jpg"},
        {name: "Ena Allo Meros", image: "https://cdn.pixabay.com/photo/2016/11/21/16/02/bar-1846137__340.jpg"},
        {name: "Ena Trito Meros", image: "https://cdn.pixabay.com/photo/2016/11/18/22/21/architecture-1837150__340.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){ //same path /campgrounds --> REST convention
    //get data from form and add to the array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
    
});

app.get("/campgrounds/new", function(req, res){ // RESTfull. will show the form that will send the data to the post route
    res.render("new");
});












app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is ready!");
});