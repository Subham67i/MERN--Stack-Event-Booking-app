const mongoose  = require("mongoose")


const EventSchema = new mongoose.Schema({
    user : {
       type : mongoose.Schema.Types.ObjectId , ref : "user"
    },
    name : {
        type : String,
        required : true
    },
     image : {
       type : String,
        required : true
    },
     date : {
      type : String,
        required : true
    },
     type : {
       type : String,
        required : true
    },
     price : {
       type : Number,
        required : true
    },
    info : {
        type : String
    },
    created : {
      type : Date,
        default : Date.now
    },
})

const EventModel = mongoose.model("event", EventSchema)

module.exports = EventModel