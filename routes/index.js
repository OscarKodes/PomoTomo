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

// Register Get route is not needed
// The front page has a Register popup form

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

// Login Get route is not needed
// The front page has a Login popup form

// handle login
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/front",
    failureRedirect: "/front"
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
    res.redirect("/front");
  }
}

module.exports = router;
