const asyncHandler = require('express-async-handler');
const Ride = require('../models/Ride');

// @desc    Create New Ride
// @route   POST /api/rides
// @access  Public
const createRide = asyncHandler(async (req, res) => {
  const {
    origin_address, destination_address, origin_latitude, origin_longitude,
    destination_latitude, destination_longitude, ride_time, ride_price,
    payment_status, driver_id, user_email, driver_snapshot
  } = req.body;
  
  const ride = new Ride({
    origin_address, destination_address, origin_latitude, origin_longitude,
    destination_latitude, destination_longitude, ride_time, ride_price,
    payment_status, driver_id, user_email, driver_snapshot
  });

  const createdRide = await ride.save();
  res.status(201).json(createdRide);
});

// @desc    Get All Rides
// @route   GET /api/rides
// @access  Public
const getRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find();
  res.json(rides);
});

// @desc    Get Ride by ID
// @route   GET /api/rides
// @access  Public
const getOneRide = asyncHandler(async (req, res) => {
    const { email } = req.params;
  
    const ride = await Ride.findOne({ user_email: email });
  
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
  
    res.json(ride);
  });
  

// @desc    Update Ride
// @route   PUT /api/ride/:email
// @access  Public
const updateRide = asyncHandler(async (req, res) => {
    const email = req.params.email; // Use email from the URL parameters
    const ride = await Ride.findOne({ user_email: email });
  
    if (!ride) {
      res.status(404);
      throw new Error('Ride not found');
    }
  
    const updatedRide = await Ride.findByIdAndUpdate(ride._id, req.body, {
      new: true, // Return the updated document
    });
  
    res.json(updatedRide);
  });

// @desc    Delete Ride
// @route   DELETE /api/rides/:email
// @access  Public
const deleteRide = asyncHandler(async (req, res) => {
    const email = req.params.email; // Get the email from the URL parameters
    const ride = await Ride.findOne({ user_email: email });
  
    if (!ride) {
      res.status(404);
      throw new Error('Ride not found');
    }
  
    await Ride.deleteOne({ _id: ride._id }); // Delete the ride using its ID
    res.json({ message: 'Ride removed' });
  });

module.exports = {
  createRide,
  getRides,
  getOneRide,
  updateRide,
  deleteRide,
};
