const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, 
    },
    comment: {
      type: String,
      required: true,
      maxlength: 255, 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Review', reviewSchema);