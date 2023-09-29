const app=require('./app')
const dotenv=require("dotenv")
const database=require('./mongodb/database')
dotenv.config({path:'./config.env'})


database()


app.use(( err,req,res,next)=>{


res.status(err.statusCode).json({message:err.message})
})
app.listen(8080,()=>{
  console.log('server is running on port 8080');
})