const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your name.'],
    minLength: 8,
    select: false,
    validate: {
      // will only work on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimeStamp, jwtTimeStamp);
    return jwtTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
