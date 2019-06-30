var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("Hi there!");
});

app.get("/bye", function(req, res){
    res.send("Bye Bye");
});

app.get("/dog", function(req, res){
    res.send("alfa re gav gav");
});

app.get("*", function(req, res){ //Has to go at the end
    res.send("astriskos");
});













app.listen(process.env.PORT, process.env.IP);