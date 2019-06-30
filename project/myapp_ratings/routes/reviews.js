var express = require("express");
var router = express.Router({mergeParams: true});
var Bar = require("../models/bar");
var Review = require("../models/review");

// Reviews Index
router.get("/", function (req, res) {
    Bar.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, bar) {
        if (err || !bar) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {bar: bar});
    });
});

// Reviews New
router.get("/new", isLoggedIn, checkReviewExistence, function (req, res) {
    // middleware checkReviewExistence checks if a user already reviewed the campground, 
    // only one review per user is allowed
    Bar.findById(req.params.id, function (err, bar) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {bar: bar});

    });
});

// Reviews Create
router.post("/", isLoggedIn, checkReviewExistence, function (req, res) {
    //lookup bar using ID
    Bar.findById(req.params.id).populate("reviews").exec(function (err, bar) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated bar to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.bar = bar;
            //save review
            review.save();
            bar.reviews.push(review);
            // calculate the new average review for the bar
            bar.rating = calculateAverage(bar.reviews);
            //save bar
            bar.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/bars/' + bar._id);
        });
    });
});

// Reviews Edit
router.get("/:review_id/edit", checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {bar_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/:review_id", checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Bar.findById(req.params.id).populate("reviews").exec(function (err, bar) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate bar average
            bar.rating = calculateAverage(bar.reviews);
            //save changes
            bar.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/bars/' + bar._id);
        });
    });
});

// Reviews Delete
router.delete("/:review_id", checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Bar.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, 
        {new: true}).populate("reviews").exec(function (err, bar) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate bar average
            bar.rating = calculateAverage(bar.reviews);
            //save changes
            bar.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/bars/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

//Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

function checkReviewExistence(req, res, next) {
    if (req.isAuthenticated()) {
        Bar.findById(req.params.id).populate("reviews").exec(function (err, foundBar) {
            if (err || !foundBar) {
                req.flash("error", "Bar not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundBar.reviews
                var foundUserReview = foundBar.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("back");
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

function checkReviewOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};


module.exports = router;