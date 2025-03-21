const express = require("express");
const {registerUser,loginUser}=require('../controllers/authController')
const router = express.Router();
const passport = require('passport');
const { googleAuth, googleAuthCallback } = require('../controllers/authController');
const {verifyTokens}=require('../middlewares/auth')
const User= require('../models/User')
const {auth} = require("../middlewares/auth");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.post('/logout',(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    res.clearCookie('connect.sid'); 
    res.clearCookie('userId'); 
    res.json({ message: 'Logged out successfully' });
  });
})
router.get("/profile", async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in cookies" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
  module.exports = router;

