const jwt = require('jsonwebtoken');
const User = require('../models/User');

function verifyTokens(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    console.log(req.userData.id)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function verifyTokensAndAuthorization(req, res, next) {
  verifyTokens(req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (req.userData.id === req.params.id || req.userData.isAdmin) {
      return next();
    } else {
      return res
        .status(403)
        .json({
          message:
            "You are not allowed to update this user, you can only update your account",
        });
    }
  });
}

module.exports={verifyTokensAndAuthorization}
