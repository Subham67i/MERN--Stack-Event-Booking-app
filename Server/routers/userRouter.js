const express = require("express");
const UserModel = require("../models/User")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt");
const gravatar = require("gravatar")
const jwt = require("jsonwebtoken")
const router = express.Router()
require("dotenv").config()

// Register User 
// URL http://127.0.0.1:5000/api/user/register
// method : post
// parma : name , email , password 
// access : public

router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required")
], async (req, res) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
    }

    try {

        let { name, email, password } = req.body;

        // check user is already exist
        let user = await UserModel.findOne({ email: email });
        if (user) {
            return res.status(401).json({ errors: [{ msg: "User is already exist" }] })
        }

        // bcrypt  the  password
        let salt = await bcrypt.genSalt(10)
        let hashPassword = await bcrypt.hash(password, salt)

        // avater url 
        let avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });

        let isAdmin = false

        // save user db
        user = new UserModel({ name, email, password: hashPassword, avatar, isAdmin })
        user = await user.save()

        // jwt token 
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        }
        // set jwt token
        let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        // Set token in HTTP-only cookie
        res.cookie("token", token,)

        res.status(200).json({
            msg: "Registration is Success", token,
            user: {
                id: user.id,
                name: user.name
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
})

// Login User 
// URL http://127.0.0.1:5000/api/user/login
// method : post
// parma :  email , password 
// access : public

router.post("/login", [
    body("password").notEmpty().withMessage("Password is required"),
    body("email").notEmpty().withMessage("Email is required"),], async (req, res) => {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() })
        }
        try {
            // login User here
            const { email,password } = req.body
            // check user 
            let user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] })
            }
            // check password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.status(401).json({ errors: [{ msg: "Invalid credentials" }] })
            }
           
            // set jwt token 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

             // generate jwt token 
            const payload = {
                user,
                token
            }

            // Set token in HTTP-only cookie
            res.cookie("token", token,)
            res.status(200).json({ message: "login Success" } , payload);

        } catch (error) {
            console.log(error);
            res.status(500).send("Server error");
        }
    })

// LogOut User 
// URL http://127.0.0.1:5000/api/user/logout
// method : get
// parma : no
// access : private 

router.get("/logout", (req, res) => {
    res.clearCookie( "token" , " ");
    res.status(200).json({ message: "Logged out successfully" });
});
                 
module.exports = router