const mongoose = require('mongoose');

/**
 * DrinkCounter stores the accumulated drink counts for each user.
 * One document per user — upserted on every add operation.
 */
const drinkCounterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one record per user
      index: true,
    },
    cerveza: {
      type: Number,
      default: 0,
      min: 0,
    },
    copa: {
      type: Number,
      default: 0,
      min: 0,
    },
    chupito: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DrinkCounter', drinkCounterSchema);
