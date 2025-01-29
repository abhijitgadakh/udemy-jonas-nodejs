const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// 1 - MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from Middleware 🙌');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// 2 - ROUTE-HANDLERS
const getAllTours = (req, res) => {
  return res.status(200).json({
    message: 'Tours fetched successfully',
    requestAt: req.requestTime,
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

const getAllUsers = (req, res) => {
  return res.status(200).json({
    message: 'Users fetched successfully',
    requestAt: req.requestTime,
    result: users.length,
    data: { users },
  });
};

const createUser = (req, res) => {
  const user = Object.assign({ _id: users.length }, req.body);

  users.push(user);

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      return res.status(201).json({
        message: 'user added successfully',
        data: { user },
      });
    }
  );
};

const getUserById = (req, res) => {
  const id = req.params.id;

  const user = users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).json({
      message: 'user with id Not Found',
    });
  }

  return res.status(200).json({
    message: 'user fetched successfully',
    data: { user },
  });
};

const updateUser = (req, res) => {
  const id = req.params.id;

  const user = users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).json({
      message: 'user with id Not Found',
    });
  }

  const userIndex = users.findIndex((user) => user._id === id);
  const updatedUser = { ...req.body, ...user };

  users[userIndex] = updatedUser;

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      return res.status(201).json({
        message: 'User added successfully',
        data: { updatedUser },
      });
    }
  );
};

const deleteUser = (req, res) => {
  const id = req.params.id;

  const Updatedusers = users.filter((user) => user._id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(Updatedusers),
    (err) => {
      return res.status(204).json({
        message: 'user deleted successfully',
        data: null,
      });
    }
  );
};

// 3 - ROUTES
// For TOURS
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

//For Users
app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

// 4 - START SEVER
const port = 3000;
app.listen(port, () => {
  console.log('listening to port: ' + port);
});
