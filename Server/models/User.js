const mongoose  = require("mongoose")


const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
     email : {
       type : String,
        required : true
    },
     password : {
      type : String,
        required : true
    },
     avatar : {
       type : String,
        required : true
    },
     isAdmin : {
       type : Boolean,
        required : true
    },
    created : {
      type : Date,
        default : Date.now
    },
})

const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel