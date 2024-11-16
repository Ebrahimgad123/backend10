const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  images: [String],
  openingHours: String,
  entryFee: String,
  ratings: { type: Number, default: 0 },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
});

module.exports = mongoose.model('Place', placeSchema);
