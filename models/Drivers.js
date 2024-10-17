const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 1,
  },
  last_name: {
    type: String,
    required: true,
    minlength: 1,
  },
  profile_image_url: {
    type: String,
    required: false,
  },
  car_image_url: {
    type: String,
    required: false,
  },
  car_seats: {
    type: Number,
    required: true,
    min: 1,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
