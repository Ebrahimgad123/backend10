const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const passport = require('passport');
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

const googleAuth = (req, res, next) => {
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account'
  })(req, res, next);
};
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.redirect('/login'); // إعادة التوجيه عند حدوث خطأ
    }

    if (!user) {
      console.error('No user found after Google authentication');
      return res.redirect('/login'); // إعادة التوجيه إذا لم يتم العثور على المستخدم
    }

    try {
      // تسجيل دخول المستخدم وإنشاء جلسة
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Error logging in user:', loginErr);
          return res.redirect('https://tour-relax.vercel.app/login'); // إعادة التوجيه عند حدوث خطأ
        }
        res.cookie('userId', user._id.toString(), {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'None', 
        });
        


        // إعادة التوجيه بعد تسجيل الدخول الناجح
        return res.redirect('https://tour-relax.vercel.app/getlocation');
      });
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return res.redirect('https://tour-relax.vercel.app/login');
    }
  })(req, res, next);
};

module.exports = { googleAuth, googleAuthCallback,registerUser ,loginUser};
