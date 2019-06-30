var mongoose   = require("mongoose");
var Camp       = require("./models/camp");
var Comment    = require("./models/comment");

var data = [
    {
        name: "ena magazi",
        image: "https://cdn.pixabay.com/photo/2018/08/10/21/52/restaurant-3597677__340.jpg",
        description: "magazaki pollan kalo"
    }, 
    {
        name: "deutero magazi",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/07/restaurant-690975__340.jpg",
        description: "magazaki pollan kalo epishs"
    }, 
    {
        name: "trito magazi",
        image: "https://cdn.pixabay.com/photo/2016/11/18/14/05/brick-wall-1834784__340.jpg",
        description: "magazaki pollan kalo ksanaepishs"
    }
    ];


function seedDB(){
    //Remove all camps
    Camp.remove({}, function(err){
         if (err) {
            console.log(err);
         } else {
            console.log("Removed camps!!")
           }
            //Add a few camps
            data.forEach(function(seed){
                Camp.create(seed, function(err, camp){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Camp added!!");
                        //create a comment
                        Comment.create(
                            {
                                text: "ta biftekia htan kammena re keratades",
                                author: "Giwrgakias"
                            }, function(err, comment){
                                if (err) {
                                    console.log(err);
                                } else {
                                    camp.comments.push(comment);
                                    camp.save();
                                    console.log("created new comment");
                                }
                            });
                      } 
                });
            });
    });
   
    
    
    //Add a few comments
    
};


module.exports = seedDB;
