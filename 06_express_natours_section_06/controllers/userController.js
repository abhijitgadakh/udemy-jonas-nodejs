const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
);

exports.getAllUsers = (req, res) => {
  return res.status(200).json({
    message: 'Users fetched successfully',
    requestAt: req.requestTime,
    result: users.length,
    data: { users },
  });
};

exports.checkBody = (req, res, next, id) => {
  if (!req.body.name || req.body.orice) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
};

exports.createUser = (req, res) => {
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
    },
  );
};

exports.getUserById = (req, res) => {
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

exports.updateUser = (req, res) => {
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
    },
  );
};

exports.deleteUser = (req, res) => {
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
    },
  );
};
