const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require("uuid");

const createPayment = async (req, res) => {
  const { fullName, email, amount, driver_id, ride_time, token } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      customer: customer.id,
      receipt_email: email,
    });

    if (charge) {
      const newPayment = new Payment({
        fullName,
        email,
        amount,
        driver_id,
        ride_time,
        payment_status: "completed",
      });

      await newPayment.save();

      res.status(200).json({ message: "Payment successful", payment: newPayment });
    } else {
      res.status(500).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPayment };
