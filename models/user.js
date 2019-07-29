/*jshint esversion: 6 */
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const daySchema = new mongoose.Schema({
  date: String,
  pomos: Number,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  name: String,
  days: [daySchema],
  alarmSound: {
    type: Number,
    default: 0
  },
  pomoUpSound: {
    type: Number,
    default: 0
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
