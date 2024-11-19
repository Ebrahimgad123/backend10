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

  module.exports = router;

