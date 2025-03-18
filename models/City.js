const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  country:String,
  image:String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

citySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('City', citySchema);
