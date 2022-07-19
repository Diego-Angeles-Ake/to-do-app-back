// Authorization & Encryption
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');
const { Task } = require('../models/task.model');

// Helpers
const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');

const signup = catchAsync(async (req, res, next) => {
  // Retrieve data
  const { username, email, password, role } = req.body;

  // Encrypt password
  const salt = await bcryptjs.genSalt(12);

  const hashPassword = await bcryptjs.hash(password, salt);

  let newUser = {};
  try {
    // Store user
    newUser = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
  } catch (err) {
    if ((err.code = '23505')) {
      return next(new AppError('Email is already taken', 400));
    }
  }

  // Obfuscate password
  newUser.password = undefined;

  // Send success response
  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  // Retrieve data
  const { email, password } = req.body;

  // Validate that user exists
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Validate credentials
  const areValidCredentials =
    user && (await bcryptjs.compare(password, user.password));

  if (!areValidCredentials) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Obfuscate password
  user.password = undefined;

  // Send success response
  res.status(200).json({ token, user });
});

const getUserTasks = catchAsync(async (req, res, next) => {
  // Retrieve sessionUser from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Search for tasks created by the current user
  const tasks = await Task.findAll({
    where: {
      userId,
      status: 'active',
      is_completed: false,
    },
  });

  // Send success response
  res.status(200).json({ tasks });
});

const getUserCompletedTasks = catchAsync(async (req, res, next) => {
  // Retrieve sessionUser from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Search for tasks created by the current user
  const tasks = await Task.findAll({
    where: {
      userId,
      is_completed: true,
      status: 'active',
    },
  });

  // Send success response
  res.status(200).json({ tasks });
});

const updateUser = catchAsync(async (req, res, next) => {
  // Retrieve user from userExists middleware
  const { user } = req;

  // Retrieve data
  const { username, email } = req.body;

  // Update user
  await user.update({ username, email });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  // Retrieve user data from userExists middleware
  const { user } = req;

  // Soft-delete user
  await user.update({ status: 'inactive' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

module.exports = {
  signup,
  login,
  getUserTasks,
  getUserCompletedTasks,
  updateUser,
  deleteUser,
};
