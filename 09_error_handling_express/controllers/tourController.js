const { Query } = require('mongoose');
const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/APIFeatures');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // 1 - FILTERING

    // 2 - SORTING

    // 3  FIELD LIMITING

    // 3  PAGINATION

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    return res.status(200).json({
      success: true,
      message: 'Tours fetched successfully',
      requestAt: req.requestTime,
      result: tours.length,
      data: { tours },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });

    return res.status(200).json({
      message: 'Tour fetched successfully',
      requestAt: req.requestTime,
      data: { tour },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
      message: 'Tour added successfully',
      data: { newTour },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(201).json({
      message: 'Tour updated successfully',
      data: { tour },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stat = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    return res.status(201).json({
      message: 'Tour stats fetched successfully',
      data: { stat },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    return res.status(201).json({
      message: 'Tour stats fetched successfully',
      data: { count: plan.length, plan },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + err,
    });
  }
};
