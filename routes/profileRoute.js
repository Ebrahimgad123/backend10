const express = require('express');
const { verifyTokensAndAuthorization } = require('../middlewares/verify&authrization');
const { getProfile, updateProfile } = require("../controllers/profileController");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const router = express.Router();

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const isValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) && allowedFileTypes.test(file.mimetype);

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png) are allowed'));
    }
};

const upload = multer({ storage, fileFilter });

// Profile routes
router.route('/profile')
    .get( getProfile)   // Get user profile
    .put(verifyTokensAndAuthorization, upload.single("image"), updateProfile); // Update user profile

module.exports = router; // Export the router

