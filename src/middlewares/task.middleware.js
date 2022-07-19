// Models
const { Task } = require('../models/task.model');

// Helpers
const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');

const taskExists = catchAsync(async (req, res, next) => {
  // Retrieve id from query string
  const { id } = req.params;

  // Search for available task with given ID
  const task = await Task.findOne({
    where: { id, status: 'active' },
  });

  if (!task) {
    return next(new AppError('Task not found with given ID', 404));
  }

  // Append task data to the req object
  req.task = task;
  next();
});

const taskOwnerAuth = catchAsync(async (req, res, next) => {
  // Retrieve sessionUser from protectToken and task from taskExists
  // middlewares
  const { sessionUser, task } = req;

  if (sessionUser.id !== task.userId) {
    return next(new AppError('You do not own this task', 403));
  }

  next();
});

module.exports = {
  taskExists,
  taskOwnerAuth,
};
