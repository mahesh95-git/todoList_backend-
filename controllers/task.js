const errorhandler = require("../util/errorhandler");
const task = require("../models/task");
const { json } = require("express");
exports.createNewtask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    await task.create({ title, description, user_id: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "new task added successflly " });
  } catch (error) {

    next(new errorhandler(500, "internal sever error please try again"));
  }
};
exports.getAllToDo = async (req, res, next) => {
  try {
    let tasks = await task.find({ user_id: req.user._id });
    if (!tasks) {
      return res.status(201).json({ success: true, message: "no todo list " });
    }
    return res.status(201).json({ success: true, data: tasks });
  } catch (err) {
    return next(new errorhandler(500, "interanl sever error"));
  }
};
exports.updateToDo = async (req, res, next) => {
  try {
    const id = req.params.taskId;
    const updateTask = await task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateTask) {
      return res.status(403).send("not found");
    }
    res.status(201).json({ success: true, message: "sucessfully change Todo" });
  } catch (error) {
    return next(new errorhandler(500, "interanl sever error"));
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    let deleteId = req.params.taskId;
    let deletedTask = await task.findOneAndDelete({
      _id: deleteId,
      user_id: req.user._id,
    });
    if (!deletedTask) {
      return res.status(403).json({success:true,message:"not found"});
    }
res.status(201),json({success:true,message:"successfully deleted"})  
  } catch (e) {
    return next(new errorhandler(500, "Internal Server Error"));
  }
};
