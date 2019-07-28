/*jshint esversion: 6 */
const express  = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");


// INDEX ROUTE
// No need.

// NEW ROUTE
// Register routes take care of this.

// CREATE ROUTE
// Register routes take care of this.

// SHOW ROUTE
// for user stats and settings page

// EDIT ROUTE
// settings page

// UPDATE ROUTE
// for user's pomos, and settings
router.put("/:id", function(req, res){

  // console.log(req.body.breakOn);

  let today = new Date();
  today = today.toDateString();

  // search to see if current user has a record for today
  User.findOne(
    {
      "_id": req.params.id,
      "days.date": today
    }, function(err, userWithToday){
      if (err) {
        console.log(err);
        res.redirect("back");
      } else if (!userWithToday) {
        // if the current user does not have a record for today
        // we must make one, by looking for the current user
        User.findById(req.params.id, function(err, foundUser){
          if (err) {
            console.log(err);
            res.redirect("/front");
          } else {
            let newDay = {
              date: today,
              pomos: 1
            }
            foundUser.days.push(newDay);
            foundUser.save();
            console.log(foundUser);
            res.redirect("/front/b");
          }
        });
      } else {
        // if current user found with current day, just update the pomo
        let currDay = userWithToday.days[0];
        currDay.pomos++;
        userWithToday.save();
        console.log(userWithToday);
        res.redirect("/front/b");
      }
  });
});

// DESTROY ROUTE
// Maybe no need.


module.exports = router;
