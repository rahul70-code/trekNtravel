var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function (req, res, next) {
    const { id } = req.params;
    if (req.isAuthenticated()) {
        Campground.findById(id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found")
                res.redirect("back");
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first!")
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwnership = function (req, res, next) {
    const { comment_id } = req.params;
    if (req.isAuthenticated()) {
        Comment.findById(comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first")
        res.redirect("back");
    }
};

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login")
}


module.exports = middlewareObject;