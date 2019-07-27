/*jshint esversion: 6 */
// Require Packages
require('dotenv').config();
const express = require("express"),
      app     = express(),
      ejs     = require("ejs"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      session = require("express-session"),
      GoogleStrategy = require("passport-google-oauth20").Strategy;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/pomo",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


// this is middleware function that'll run on every route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

mongoose.connect("mongodb://localhost:27017/pomotomo",
{
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});


app.get("/", function(req, res){
  res.redirect("front");
});

app.get("/front", function(req, res){
  res.render("front");
});

app.get("/secrets", isLoggedIn, function(req, res){
  res.render("secrets");
});

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

// handle user registration
app.post("/register", function(req, res){

  User.register(
    {email: req.body.email},
    req.body.password,
    function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/front");
      });
    }
  });
});

/// Google Register/Login
app.get("/auth/google",
  passport.authenticate("google", {scope: ["profile"]})
);

/// Google Callback url route,
/// after google has registered/logged them in
/// we need to log them in ourselves!
app.get("/auth/google/pomo", passport.authenticate("google",
{
  successRedirect: "/front",
  failureRedirect: "/login"
}),
  function(req, res) {
});

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

// handle login
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    failureRedirect: "/login"
  }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


// Middleware functions
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}



app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
