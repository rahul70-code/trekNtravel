var express    = require("express"),
    bodyParser = require("body-parser"),
    app        = express(),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    flash      = require("connect-flash"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB    = require("./seeds"),
    methodOveride = require("method-override");
    

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/index");
    
app.use(methodOveride("_method"));

app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb+srv://travelntrek:alliswell@cluster0-blofl.mongodb.net/test?retryWrites=true",  { useNewUrlParser: true, useCreateIndex: true });
// mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });
// seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
 secret: "Rahul IAS",
 resave: false,
 saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 res.locals.error= req.flash("error");
 res.locals.success= req.flash("success");
 next();
})

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server started!")
});

