const mongoose = require('mongoose');

const driverLocationSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver',
  },
  latitude: {        //خط العرض 
    type: Number,
    required: true,
  },
  longitude: {      // خط الطول
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
