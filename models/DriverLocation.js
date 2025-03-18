const mongoose = require('mongoose');

const driverLocationSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver',
  },
  latitude: {        
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const DriverLocation = mongoose.model('DriverLocation', driverLocationSchema);
module.exports = DriverLocation;
