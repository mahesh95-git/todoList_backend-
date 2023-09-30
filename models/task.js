const mongoose = require("mongoose");

const taskSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: [true,"please enter title" ],
  },
  description: {
    type: String,
    required: [ true,"please enter description"],
  },
  completed:{
    type:Boolean,
    default:false
  },

  completedDate: {
    type: Date,
    default: null,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("task", taskSchema);
