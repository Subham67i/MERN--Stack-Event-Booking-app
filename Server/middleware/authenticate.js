const jwt = require("jsonwebtoken")

const  authenticat = (req , res, next) => {
    // get token from cookies
let token = req.cookies.token;
    // If no token 
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try{
       const decoded = jwt.verify( token, process.env.JWT_SECRET_KEY );
       req.user = decoded.user
       next();
    } catch(error) {
        console.log(error);
        res.status(401).json({ msg: "Token is not valid" });
    }
}

module.exports =  authenticat