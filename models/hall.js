const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  reviews: {
    type: [{ rating: Number, comment: String }],
    default: [],
  },
  photos: {
    type: [String], // Array of photo URLs
    default: [],
  },
  about: {
    type: String,
    required: true,
  },
  pricePerPlate: {
    type: Number,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  
});

const Hall = mongoose.model('Hall', hallSchema);

module.exports = Hall;
