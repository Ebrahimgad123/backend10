const Joi = require('joi');

const rideValidationSchema = Joi.object({
  origin_address: Joi.string().required(),
  destination_address: Joi.string().required(),
  origin_latitude: Joi.number().required(),
  origin_longitude: Joi.number().required(),
  destination_latitude: Joi.number().required(),
  destination_longitude: Joi.number().required(),
  ride_time: Joi.number().required(),
  ride_price: Joi.number().required(),
  payment_status: Joi.string().valid('pending', 'paid', 'failed').required(),
  driver_id: Joi.string().required(),
  user_email: Joi.string().email().required(),
  driver_snapshot: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    car_seats: Joi.number(),
  }).optional(),
});

const validateRide = (req, res, next) => {
  const { error } = rideValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateRide;
