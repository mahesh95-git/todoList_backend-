const express=require("express")
const { createNewtask, getAllToDo, updateToDo, deleteTodo } = require("../controllers/task")
const { authinticated } = require("../controllers/auth")
const router=express.Router()
router.route('/newTask').post(createNewtask)
router.route('/allTodo').get(authinticated,getAllToDo)
router.route('/Todo/:taskId').patch(authinticated,updateToDo).delete(authinticated,deleteTodo)

module.exports=router