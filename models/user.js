/*jshint esversion: 6 */
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  pomos: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  name: String,
  days: [daySchema],
  alarmSound: {
    type: String,
    default: "Default"
  },
  pomoUpSound: {
    type: String,
    default: "Default"
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
