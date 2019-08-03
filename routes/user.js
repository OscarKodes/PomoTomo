/*jshint esversion: 6 */
const express  = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const statsProcess = require("../modules/statsProcess")


// INDEX ROUTE================================
// No need.

// NEW ROUTE==================================
// Register routes take care of this.

// CREATE ROUTE===============================
// Register routes take care of this.

// SHOW ROUTE=================================
// User's Stats Page
router.get("/:id", isLoggedIn, function(req, res){

  User.findById(req.params.id, function(err, foundUser){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      let statObj = statsProcess(foundUser.days);
      res.render("stats", {days: foundUser.days, stats: statObj});
    }
  });
});

// EDIT ROUTE============================================
// Custom Time Settings page
router.get("/:id/edit", isLoggedIn, function(req, res){
  res.render("settings");
});

// UPDATE ROUTES========================================
// Update route for User's submitted custom time settings
router.put("/:id/time", isLoggedIn, function(req, res){

  User.findById(req.params.id, function(err, foundUser){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      foundUser.pomoMin = req.body.pomoMin;
      foundUser.breakMin = req.body.breakMin;
      foundUser.longBreakMin = req.body.longBreakMin;
      foundUser.save();
      res.redirect("/front");
    }
  });
});

// Update route for User's submitted custom sound settings
router.put("/:id/sound", function(req, res){

  User.findById(req.params.id, function(err, foundUser){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      foundUser.alarmSound = req.body.alarmSoundInput;
      foundUser.pomoUpSound = req.body.pomoUpSoundInput;
      foundUser.save();
      console.log(foundUser);
      res.redirect("/front");
    }
  });
});

// Update route to record user's pomos
router.put("/:id", isLoggedIn, function(req, res){

  let today = new Date();
  today = today.toDateString();

  // search to see if current user has a record for today
  User.findById(req.params.id, function(err, foundUser){
      let userRecentDay = foundUser.days[0];
      if (err) {
        console.log(err);
        res.redirect("back");
      } else if (!userRecentDay || userRecentDay.date !== today) {
        // if the current user does not have a record for today
        // we must make one
          let newDay = {
            date: today,
            pomos: 1
          }
          foundUser.days.unshift(newDay);
          foundUser.save();
          console.log(foundUser);
          res.redirect("/front/b");
      } else {
        // if current user found with current day, just update the pomo
        let currDay = foundUser.days[0];
        currDay.pomos++;
        foundUser.save();
        console.log(foundUser);
        res.redirect("/front/b");
      }
  });
});


// DESTROY ROUTE
// Maybe no need.

// Middleware functions
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/front");
  }
}


module.exports = router;
