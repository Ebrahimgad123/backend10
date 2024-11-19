const User = require('../models/User');
const mongoose = require('mongoose');
const asyncHandler=require('express-async-handler')

const getProfile = asyncHandler(async (req, res) => {
  const user =  req.session.user;; 

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: user._id,
    profilePicture: user.profilePicture,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailStatus: user.emailStatus,
    phoneNumber: user.phoneNumber,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// @desc Update user profile
// @route PUT /api/profile
// @access Private (token required)
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // استخدم req.user.id هنا أيضًا
      
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // إعداد عنوان URL للصورة المرفوعة
    if (req.file) {
        const imageUrl = `http://localhost:8000/images/${req.file.filename}`;
        user.profilePicture = imageUrl; // تحديث حقل profilePicture بالصورة الجديدة
    }

    // تحديث حقول المستخدم الأخرى
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    // حفظ المستخدم المحدث
    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        profilePicture: updatedUser.profilePicture,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    });
});

module.exports = { getProfile, updateProfile };
