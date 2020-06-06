var mongoose = require("mongoose");
var User = require("../models/user");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   title: String,
   image: String,
   descrip: String,
   price: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
})

module.exports = mongoose.model("Campground", campgroundSchema)