const jwt = require('jsonwebtoken');
const User = require('../models/User');

function verifyTokens(req, res, next) {
  const token = req.headers.token;
  console.log('cookies===============',req.cookies)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET,(req,res)=>{
        req.userID = decoded._id;
        console.log(req.userID)
        next();
    });

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
module.exports={verifyTokens}