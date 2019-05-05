var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js")

//HOME PAGE
router.get("/",function(req,res){
    res.render("campgrounds/home");
})

// campgrounds page
router.get("/campgrounds", function(req, res){
 Campground.find({}, function(err, allcampgrounds){
  if(err){
   console.log(err);
  } else{
    res.render("campgrounds/campgrounds", {campgrounds: allcampgrounds, currentUser: req.user});
  }
 })
})

// post a new campground
router.post("/campgrounds",middleware.isLoggedIn , function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var price = req.body.price;
    var descrip = req.body.descrip;
    var author = {
     id: req.user._id,
     username: req.user.username,
    };
    var NewCampgrounds = {title: title, image: image, descrip: descrip, author: author, price: price};
   // campgrounds.push(NewCampgrounds);
   Campground.create(NewCampgrounds, function(err, newlycreated){
    if(err){
     console.log(err);
    } else{
     req.flash("success", "Successfully added Campground")
     res.redirect("/campgrounds");
     console.log(newlycreated);
    }
   });
});

// add a new campground
router.get("/campgrounds/new",middleware.isLoggedIn ,function(req, res){
    res.render("campgrounds/campgrounds_new")
})

// SHOW CAMPGROUND
router.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
  if(err) {
   console.log("error");
  } else {
   res.render("campgrounds/show", {campground: foundCamp});
  }
 });
});

// EDIT CAMPGROUND
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundcampground){
     if (err){
      res.render("/campgrounds");
     } else {
      res.render("campgrounds/edit", {campground: foundcampground});
     }
    })
    
})

// UPDATE CAMPGROUND
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
 Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
  if (err){
   res.redirect("/campgrounds");
  } else {
   req.flash("success", "Successfully edited Campground!");
   res.redirect("/campgrounds/" + req.params.id)
  }
 })
})

// DESTROY CAMPGROUND
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
 Campground.findByIdAndRemove(req.params.id, function(err){
  if (err){
   res.redirect("/campgrounds");
  }
  req.flash("success", "Successfully Deleted Campground")
  res.redirect("/campgrounds");
 });
});





module.exports = router;