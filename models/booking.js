const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
