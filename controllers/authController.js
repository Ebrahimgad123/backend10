const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { displayName, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    displayName,
    email,
    password: hashedPassword,
  });

  // Save the user in the database
  const savedUser = await user.save();

  // Return user data and token if successful
  if (savedUser) {
    res.status(201).json({
      _id: savedUser._id,
      displayName: savedUser.displayName,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      isAdmin: savedUser.isAdmin,
      token: generateToken(savedUser._id), // Generate a JWT token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Generate a JWT token
      message:'You logged in successfully'
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});



//auth google 

const passport = require('passport');

// التحكم في طلب تسجيل الدخول عبر Google
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// التحكم في الـ callback بعد تسجيل الدخول الناجح
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.time('Redirect Time');
      console.log('Google callback successful, user:', user);
      res.redirect('http://localhost:3000'); // التوجيه إلى الواجهة الأمامية
      console.timeEnd('Redirect Time');
    });
  })(req, res, next);
};


//





module.exports={registerUser,loginUser,
                googleAuth,googleAuthCallback
}
