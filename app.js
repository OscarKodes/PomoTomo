/*jshint esversion: 6 */
// Require Packages
require('dotenv').config();
const express = require("express"),
      app     = express(),
      ejs     = require("ejs"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override");
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      session = require("express-session"),
      GoogleStrategy = require("passport-google-oauth20").Strategy;

// REQUIRE ROUTE MODULE FILES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const indexRoutes = require("./routes/index");


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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


// Tell app to use the routes and declare each route's prefix
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use(indexRoutes);



app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
