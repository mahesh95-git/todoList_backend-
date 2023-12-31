const express=require('express')
const {createNewUser} = require('../controllers/user')
const passport = require('passport')
const { logout, loginSuccess, resetPassword, forgotPassword, sendResteMail,} = require('../controllers/auth')
const router=express()
router.route('/register').post(createNewUser)
router.route('/login').post(passport.authenticate('local'),loginSuccess)
router.route('/logout').get(logout)
router.route('/resetPassword').patch(resetPassword)
router.route('/sendEmail').post(sendResteMail)
router.route('/forgotPassword/:token').patch(forgotPassword)
module.exports=router;