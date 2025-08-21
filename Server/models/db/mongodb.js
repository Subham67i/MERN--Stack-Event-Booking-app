const mongoose =  require("mongoose")
require("dotenv").config()

const mongodbUrl = process.env.MONGO_DB_URL

const mongoDbConnection = mongoose.connect(mongodbUrl)
.then(()=>{
    console.log(`Mongodb connected Successfully...`);
})
.catch((error)=>{
    console.log(error);
})

module.exports = mongoDbConnection;