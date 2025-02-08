const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have name'],
      unique: true,
      trim: true,
      minLength: [10, 'A tour must have at least 10 characters.'],
      maxLength: [40, 'A tour cannot have more than 40 characters.'],
      validate: [validator.isAlpha, 'Tour name must only contain characters.'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'Tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "Difficulty can be only 'easy', 'medium' or 'difficult'",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'A tour must have at least 1 rating'],
      max: [5, 'A tour cannot have more than 5 rating.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Price Discount {VALUE} should not be greater than actual Price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have image Cover'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
