const express = require("express");
const authenticat = require("../middleware/authenticate")
const { body, validationResult } = require("express-validator")
const Event = require("../models/Event")

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router()

// evrnt router
// URL http://127.0.0.1:5000/api/event/free
// method : get
//params : no-field
// access : public 

router.get("/free", async (req, res) => {

   try {
   
      const events = await Event.find({type : "free"})
      res.status(200).json({events})

   } catch (error) {
      console.log(error);
   }
})


// evrnt router
// URL http://127.0.0.1:5000/api/event/pro
// method : get
//params : no-field
// access : private

router.get("/pro", authenticat ,async (req, res) => {
   try {
      const events = await Event.find({type : "pro"})
      res.status(200).json({events})

   } catch (error) {
      console.log(error);
   }
})


// evrnt router
// URL http://127.0.0.1:5000/api/event/upload
// method : post
//params : name , image , date , type, price , info
// access : public 

router.post("/upload", authenticat,  upload.single("image"), [
   body("name").notEmpty().withMessage("Name is required"),
   // body("image").notEmpty().withMessage("Image is required"),
   body("date").notEmpty().withMessage("Date is required"),
   body("type").notEmpty().withMessage("Type is required"),
   body("price").notEmpty().withMessage("Price is required"),
   body("info").notEmpty().withMessage("Info is required")
], async (req, res) => {

   let errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() })
   }

   try {

      const { name, image, type, date, price, info } = req.body
      const user = req.user.id;
      let event = new Event({
         name,
         image :  req.file.filename,
         type,
         date,
         price,
         info,
         user : user
      })
      event = await event.save()

      res.status(200).json({ message: "Upload events Successfully",
         event 
       })

   } catch (error) {
      console.log(error);
   }
})




module.exports = router