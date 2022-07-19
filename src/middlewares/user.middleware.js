// Authorization
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');

// Helpers
const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');

const userExists = catchAsync(async (req, res, next) => {
  // Retrieve query string data
  const { id } = req.params;

  // Search for user with given id
  const user = await User.findOne({
    where: { id, status: 'active' },

    // Obfuscate password
    attributes: { exclude: ['password'] },
  });

  if (!user) return next(new AppError('User not found with given ID', 404));

  // Append user data to the req object
  req.user = user;
  next();
});

const protectToken = catchAsync(async (req, res, next) => {
  // Validate token
  let token;
  const isValidAuthHeader =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');
  if (isValidAuthHeader) {
    // Retrieve the token from the headers "Bearer eyJhbGciOiJIU..." -> "eyJhbGciOiJIU..."
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Invalid session', 403));
  }

  // Search for user with decoded token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  // Append user data to the req object
  req.sessionUser = user;
  next();
});

const ownerAuth = catchAsync(async (req, res, next) => {
  // Retrieve user from userExists and sessionUser from protectToken
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
});

module.exports = {
  userExists,
  protectToken,
  ownerAuth,
};
