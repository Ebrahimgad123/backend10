const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  driver_id: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver',
  },
  ride_time: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
