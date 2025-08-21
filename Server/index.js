const express =  require("express");
const mongoDbConnection = require("./models/db/mongodb")
const cors = require("cors");
var cookieParser = require('cookie-parser')
const userRouter = require("./routers/userRouter");
const eventRouter = require("./routers/eventRouter");

const app = express()
require("dotenv").config();

const port = process.env.LOCAL_PORT
const hostname = process.env.LOCALE_HOST_NAME

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000', // exact frontend origin
    credentials: true                // allow cookies/auth headers
}));

// database connection
mongoDbConnection



// router configratuion 
app.use("/api/user", userRouter)
app.use("/api/event", eventRouter)

// basic route
app.get("/", (req ,res)=>{
     res.send({
        activeStatus: true,
        error : false
    })
})


app.listen(port , hostname ,()=>{
    console.log(`Server started at http://${hostname}:${port}`);
})
