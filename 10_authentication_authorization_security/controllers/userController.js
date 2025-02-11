const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

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
    }
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
    }
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
    }
  );
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. use "/updateMyPassword"',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updateduser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updateduser) {
    return res.status(404).json({
      message: 'user Not Found',
    });
  }
  return res.status(201).json({
    message: 'User info updated successfully',
    data: { updateduser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    message: 'User deleted successfully',
    data: null,
  });
});
