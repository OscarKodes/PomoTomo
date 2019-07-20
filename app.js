const express = require("express"),
      app     = express(),
      ejs     = require("ejs"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.render("front");
});




app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
