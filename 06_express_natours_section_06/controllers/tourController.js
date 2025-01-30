const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, id) => {
  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      message: 'Invalid Id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log('hllo');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  return res.status(200).json({
    message: 'Tours fetched successfully',
    requestAt: req.requestTime,
    result: tours.length,
    data: { tours },
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      message: 'tour with id Not Found',
    });
  }

  return res.status(200).json({
    message: 'Tours fetched successfully',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  const tour = Object.assign({ id: tours.length }, req.body);

  tours.push(tour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        message: 'Tour added successfully',
        data: { tour },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      message: 'tour with id Not Found',
    });
  }

  const tourIndex = tours.findIndex((tour) => tour.id === id);
  const updatedTour = { ...req.body, ...tour };

  tours[tourIndex] = updatedTour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        message: 'Tour added successfully',
        data: { updatedTour },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const Updatedtours = tours.filter((tour) => tour.id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(Updatedtours),
    (err) => {
      return res.status(204).json({
        message: 'Tour deleted successfully',
        data: null,
      });
    }
  );
};
