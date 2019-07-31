/*jshint esversion: 6 */
const express  = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

router.get("/", function(req, res){
  res.redirect("front");
});

router.get("/front", function(req, res){
  res.render("front", {breakSetup: "OFF"});
});

router.get("/front/b", function(req, res){
  res.render("front", {breakSetup: "ON"});
});

router.get("/about", function(req, res){
  res.render("about");
});

// show register form
router.get("/register", function(req, res){
  res.render("register");
});

// handle user registration
router.post("/register", function(req, res){

  User.register(
    {username: req.body.username},
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

// show login form
router.get("/login", function(req, res){
  res.render("login");
});

// handle login
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/front",
    failureRedirect: "/login"
  }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/front");
});

// Error Page
router.get("*", function(req, res){
  res.render("error");
});


// Middleware functions
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
