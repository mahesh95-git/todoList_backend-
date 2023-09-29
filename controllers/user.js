const User=require('../models/user')
const errorhandler = require('../util/errorhandler')
const bcrypt=require('bcrypt')

exports.createNewUser=async(req,res,next)=>{
const {firstName,lastName,email,password}=req.body
    try {
const crypted= await bcrypt.hash(password,10)
console.log(crypted)
const user=await User.create({firstName:firstName,lastName:lastName,email:email,password:crypted})
        res.status(201).json(user)
    } catch (error) {
        next( new errorhandler(401,error))
    }

}

