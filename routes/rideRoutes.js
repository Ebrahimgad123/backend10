const express = require('express');
const router = express.Router();
const { createRide, getRides,  updateRide, deleteRide, getOneRide } = require('../controllers/rideController');
const rideValidationSchema = require('../validation/validateRide');

// Create a new ride
router.post('/ride', rideValidationSchema, createRide);

// Get all rides
router.get('/ride', getRides);

// Get a single ride by User email
router.get('/ride/:email', getOneRide);

// Update a ride by email
router.put('/ride/:email', rideValidationSchema, updateRide);

// Delete a ride by User email
router.delete('/ride/:email', deleteRide);

module.exports = router;
