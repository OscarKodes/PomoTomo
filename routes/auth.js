/*jshint esversion: 6 */
const express  = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

// Setup Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      googleId: profile.id,
      name: profile.name.givenName
     }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Setup Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    let name = profile.displayName;
    let firstName = name.split(" ")[0];
    User.findOrCreate({
      facebookId: profile.id,
      name: firstName
     }, function (err, user) {
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
  failureRedirect: "back"
}),
  function(req, res) {
});

/// Facebook Register/Login
router.get("/facebook",
  passport.authenticate("facebook")
);

/// Facebook Callback url route,
/// after facebook has registered/logged them in
/// we need to log them in ourselves!
router.get("/facebook/pomo", passport.authenticate("facebook",
{
  successRedirect: "/front",
  failureRedirect: "back"
}),
  function(req, res) {
});



module.exports = router;
