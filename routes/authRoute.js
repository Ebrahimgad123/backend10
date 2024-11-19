const express = require("express");
const {registerUser,loginUser}=require('../controllers/authController')
const router = express.Router();
const passport = require('passport');
const { googleAuth, googleAuthCallback } = require('../controllers/authController');
// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);




router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send('Error during logout');
    }
    res.redirect('/');
  });
});


router.get('/profile', (req, res) => {
  console.log('User:', req.user);  // طباعة بيانات المستخدم إذا كانت موجودة
  console.log('Is authenticated:', req.isAuthenticated());  // التحقق إذا كان المستخدم تم المصادقة عليه
  
  if (req.isAuthenticated()) {
    res.json({
      displayName: req.user.displayName,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: Please log in first.' });
  }
});




  module.exports = router;

