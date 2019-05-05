var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user")


// REGISTER PAGE (FORM)
router.get("/register", function(req, res) {
    res.render("authentication/register")
})

// REGISTER POST ROUTE
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
     if(err){
   req.flash("error", err.message);
      return res.render("authentication/register")
     } else{
      passport.authenticate("local")(req, res, function(){
       req.flash("success", "Successfully signedUp! Welcome to Yelpcamp " + user.username)
       res.redirect("/campgrounds")
      })
     }
    })
})

// LOGIN PAGE (FORM)
router.get("/login", function(req, res) {
    res.render("authentication/login")
})

// LOGIN POST ROUTE
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
  successFlash: "Successfully logged in",
  failureFlash: "Sorry! login failed",
}), function(req, res){
    
})

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out..")
    res.redirect("/");
})

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;