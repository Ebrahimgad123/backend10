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
  req.session.destroy(); 
  res.send('You logged Out successfully');
});

router.get("/profile", (req, res) => {
  res.status(200).json({
    displayName: req.user.displayName,
    email: req.user.email,
    profilePicture: req.user.profilePicture ? req.user.photos[0].value : null,
  });
});



  module.exports = router;

