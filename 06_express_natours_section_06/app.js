const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  return res.status(200).json({
    message: 'Tours fetched successfully',
    result: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      message: 'Invalid Id',
    });
  }

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

const createTour = (req, res) => {
  const tour = Object.assign({ id: tours.length }, req.body);

  tours.push(tour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        message: 'Tour added successfully',
        data: { tour },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      message: 'Invalid Id',
    });
  }

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

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      message: 'Invalid Id',
    });
  }

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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('listening to port: ' + port);
});
