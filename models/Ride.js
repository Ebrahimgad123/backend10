const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  origin_address: {
    type: String,
    required: true,
  },
  destination_address: {
    type: String,
    required: true,
  },
  origin_latitude: {
    type: Number,
    required: true,
  },
  origin_longitude: {
    type: Number,
    required: true,
  },
  destination_latitude: {
    type: Number,
    required: true,
  },
  destination_longitude: {
    type: Number,
    required: true,
  },
  ride_time: {
    type: Number, // Duration in minutes or seconds
    required: true,
  },
  ride_price: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver', // Reference to the Driver model
  },
  user_email: {
    type: String,
    required: true,
    unique:true
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  driver_snapshot: {
    first_name: String,
    last_name: String,
    car_seats: Number,
  },
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
