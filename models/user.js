const mongoose = require("mongoose");
const validator = require("validator");
const userschema = mongoose.Schema({

  firstName: {
    type: String,
    required: [true, "please enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "please enter last name"],
  },
  email: {
    type: String,
    required: [true, "please enter last name"],
    validater: [validator.default.isEmail, "please enter valid email"],

  },
  password: {
    type: String,
    minlength: [8, "please enter minimum 8 character"],
    required: [true, "please enter password"],
  },
  resetToken:{
    type:String

  }
  ,
  experyTokenDay:{
    type :Date,
    

  }

});


module.exports = mongoose.model("user", userschema);
