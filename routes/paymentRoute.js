const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/paymentController");

//payment
router.post("/payment", createPayment);

module.exports = router;
