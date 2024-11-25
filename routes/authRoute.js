const express = require("express");
const {registerUser,loginUser}=require('../controllers/authController')
const router = express.Router();
const passport = require('passport');
const { googleAuth, googleAuthCallback } = require('../controllers/authController');
const {verifyTokens}=require('../middlewares/auth')
const User= require('../models/User')
const {auth} = require("../middlewares/auth");
// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);




router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.get('/logout', (req, res) => {
  req.session.destroy(); 
  res.send('You logged Out successfully');
});





router.get("/profile", async (req, res) => {
  try {
    // استخراج userId من الكوكيز
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in cookies" });
    }

    // استرداد بيانات المستخدم من قاعدة البيانات
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إرسال بيانات المستخدم
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});





  module.exports = router;

