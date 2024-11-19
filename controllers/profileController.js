const User = require('../models/User');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


// الحصول على الملف الشخصي
// في المسار الذي يسترجع الملف الشخصي
const getProfile = asyncHandler(async (req, res) => {
  if (req.session && req.session.user) {
    console.log("User session:", req.session.user);
    res.json({
      _id: req.session.user._id,
      profilePicture: req.session.user.profilePicture,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.email,
      emailStatus: req.session.user.emailStatus,
      phoneNumber: req.session.user.phoneNumber,
      createdAt: req.session.user.createdAt,
      updatedAt: req.session.user.updatedAt,
    });
  } else {
    res.status(404).json({ message: "User not found in session" });
  }
});




// تحديث الملف الشخصي
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.user._id); // استخدم معرّف المستخدم من الجلسة

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // إذا تم رفع صورة جديدة
  if (req.file) {
    const imageUrl = `http://localhost:8000/images/${req.file.filename}`;
    user.profilePicture = imageUrl;
  }

  // تحديث البيانات الأخرى
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;
  if (req.body.email) user.email = req.body.email;
  if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

  // حفظ التحديثات
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
