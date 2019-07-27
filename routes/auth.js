/*jshint esversion: 6 */
const express  = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

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

/// Google Register/Login
router.get("/google",
  passport.authenticate("google", {scope: ["profile"]})
);

/// Google Callback url route,
/// after google has registered/logged them in
/// we need to log them in ourselves!
router.get("/google/pomo", passport.authenticate("google",
{
  successRedirect: "/front",
  failureRedirect: "/login"
}),
  function(req, res) {
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
