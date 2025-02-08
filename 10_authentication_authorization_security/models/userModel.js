const mongoose = require('mongoose');
const { isLowercase } = require('validator');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us you name.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    isLowercase: true,
    validate: [validator.isEmail, 'Please Provide Valid Email Id.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please Tell us your name.'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your name.'],
    minLength: 8,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
