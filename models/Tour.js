const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  images: [String],
  openingHours: String,
  entryFee: String,
  ratings: { type: Number, default: 0 },
});

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  duration: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true }, // نوع GeoJSON
    coordinates: { type: [Number], required: true }, // إحداثيات [longitude, latitude]
  },
  places: [placeSchema], // استخدام schema الأماكن داخل جولة
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

// إنشاء فهرس جغرافي على حقل الموقع
tourSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Tour', tourSchema);



