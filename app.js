var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    methodOveride = require("method-override");

// to configure .env file to store sensitive data
require('dotenv').config();

// Initialize Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

app.use(methodOveride("_method"));

app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Connected to MongoDB database using Mongoose ODM
mongoose.connect(process.env.trekNTravelDB,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(function () {
        console.log("connected to TrekNTravel DB")
    }).catch(function (err) {
        console.log("error", err.message);
    });

// mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });
// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
}));

// use passport strategy
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use flash to display messages
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// Use Routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);


app.listen(process.env.PORT, function () {
    console.log('Server started at Port 3000!');
});

