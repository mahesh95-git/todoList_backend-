const mongodb=require('mongoose')
const database=async()=>{

    
    try{
    await mongodb.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
    })
    console.log("database is connected succefully")

    }catch(error){
        console.log(error)
    }
}
module.exports=database