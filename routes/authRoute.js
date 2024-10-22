const express = require("express");
const {registerUser,loginUser}=require('../controllers/authController')
const passport = require('passport');
const router = express.Router();
const { googleAuth, googleAuthCallback } = require('../controllers/authController');
// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);


// مسار تسجيل الدخول باستخدام Google
router.get('/auth/google', googleAuth);

// مسار الـ callback بعد مصادقة Google
router.get('/auth/google/callback', googleAuthCallback);




  
  module.exports = router;
