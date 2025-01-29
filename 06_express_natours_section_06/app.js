const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ app: 'Natours', message: 'Hello from the server side' });
// });

// app.post('/', (req, res) => {
//   res.send('You can POST to this endpoint.');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  return res.status(200).json({
    message: 'Tours fetched successfully',
    result: tours.length,
    data: { tours },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
  const updatedTour = { ...tour, ...req.body };

  tours[tour.id] = updatedTour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        message: 'Tour added successfully',
        data: { tour: updatedTour },
      });
    }
  );
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length || id < 0) {
    return res.status(404).json({
      message: 'Invalid Id',
    });
  }

  const Updatedtour = tours.filter((tour) => tour.id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(Updatedtour),
    (err) => {
      return res.status(204).json({
        message: 'Tour deleted successfully',
        data: null,
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log('listening to port: ' + port);
});
