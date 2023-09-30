const express=require("express")
const user = require("./routes/user")
const passport=require("passport")
const expressSession=require("express-session")
const { auth } = require("./controllers/auth")
const tasks=require("./routes/task")
const local=require('passport-local').Strategy
const app=express()
app.use(expressSession({
    secret:'maheshrathod',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:process.env.EXPIRY_DATE
    }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new local(auth) )
app.use(express.json())

app.use('/api/v1',user)
app.use('/api/v1',tasks)

module.exports=app