const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const City = require('../models/City');
const Place = require('../models/Place');
const Tour = require('../models/Tour');
const geolib = require('geolib');

// الحصول على المدن القريبة
router.get('/nearby', async (req, res) => {
  const { latitude, longitude } = req.query;

  // تحقق إذا كانت الإحداثيات موجودة
  if (!latitude || !longitude) {
    return res.status(400).json({
      error: "Invalid request",
      details: "Latitude and Longitude are required"
    });
  }

  // تحويل الإحداثيات إلى أرقام
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  try {
    // ابحث عن المدن القريبة واحسب المسافة باستخدام aggregation
    const nearbyCities = await City.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [long, lat]
          },
          distanceField: "distanceFromUser", // سيحفظ الحقل المسافة من المستخدم
          spherical: true,
          maxDistance: 1000000 // المسافة القصوى بالأمتار
        }
      },
      {
        $project: {
          name: 1,
          country: 1,
          image: 1,
          location: 1,
          distanceFromUser: { $floor: { $divide: ["$distanceFromUser", 1000] } } // تحويل المسافة إلى كيلومترات بدون كسور
        }
      }
    ]);

    res.json(nearbyCities);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving nearby cities",
      details: error.message
    });
  }
});


router.get('/tours/nearby', async (req, res) => {
  try {
    const { longitude, latitude, cityId } = req.query;

    if (!longitude || !latitude || !cityId) {
      return res.status(400).json({ error: 'يرجى تقديم الموقع ومعرف المدينة.' });
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'إحداثيات غير صالحة.' });
    }

    const maxDistance = 10000000; // Consider making this configurable
    const nearbyTours = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance: maxDistance,
          query: { city: cityId },
        },
      },
    ]);

    const results = nearbyTours.map(tour => ({
      id: tour._id,
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      distance: Math.round(tour.dist.calculated / 1000),
      city: tour.city,
      places: tour.places,
    }));

    if (results.length === 0) {
      return res.status(404).json({ message: 'لا توجد جولات قريبة.' });
    }

    res.json(results);
  } catch (err) {
    console.error('Error finding nearby tours:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع الجولات.' });
  }
});

router.get('/City/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the city ID from the request parameters
    const city = await City.findById(id); // Find the city and populate the tours

    if (!city) {
      return res.status(404).json({ error: 'City not found.' }); // Handle case where the city is not found
    }

    res.json(city); // Return the tours associated with the city
  } catch (err) {
    console.error('Error fetching tours:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع الجولات.' });
  }
});





// الحصول على تفاصيل جولة معينة
router.get('/tours/:tourId', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId).populate('places');
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving tour', details: error.message });
  }
});




router.get('/tours', async (req, res) => {
  try {
    const { longitude, latitude } = req.query;


    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'إحداثيات غير صالحة.' });
    }

    const maxDistance = 10000000; // Consider making this configurable
    const nearbyTours = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance: maxDistance,
        },
      },
    ]);

    const results = nearbyTours.map(tour => ({
      id: tour._id,
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      distance: Math.round(tour.dist.calculated / 1000),
    }));

    if (results.length === 0) {
      return res.status(404).json({ message: 'لا توجد جولات قريبة.' });
    }

    res.json(results);
  } catch (err) {
    console.error('Error finding nearby tours:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع الجولات.' });
  }
});


module.exports = router;
