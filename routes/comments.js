var express = require("express");
var router = express.Router();
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js")


// COMMENTS PAGE (FORM)
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground })
    }
  })
})

// POST A NEW COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
  const { id } = req.params;
  const { comment } = req.body;

  Campground.findById(id, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      Comment.create(comment, function (err, comment) {
        if (err) {
          // console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Succesfully added a comment")
          res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  })
})

// EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.render("/campgrounds");
    } else {
      res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    }
  })

})

// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedcomment) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Successfully edited comment")
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

// DESTROY COMMENTS
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err, deletedcomment) {
    if (err) {
      res.redirect("back")
    } else {
      req.flash("success", "Successfully deleted comment")
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})




module.exports = router;