// Models
const { User } = require('../models/user.model');
const { Task } = require('../models/task.model');

// Helpers
const AppError = require('../helpers/app-error.helper');
const { catchAsync } = require('../helpers/catch-async.helper');

const createTask = catchAsync(async (req, res, next) => {
  // Retrieve sessionUser from protectToken middleware
  const {
    sessionUser: { id: userId },
  } = req;

  // Retrieve data from req body
  const { name, description, due_date } = req.body;

  // Store user task
  const task = await Task.create({
    name,
    description,
    due_date,
    userId,
  });

  // Send success response
  res.status(201).json({ task });
});

const getTaskInfo = catchAsync(async (req, res, next) => {
  // Retrieve task data from taksExists middleware
  const { task } = req;

  // Send success response
  res.status(200).json({ task });
});

const completeTask = catchAsync(async (req, res, next) => {
  // Retrieve task data from taskExists middleware
  const { task } = req;

  // Update task
  await task.update({ is_completed: true });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const updateTask = catchAsync(async (req, res, next) => {
  // Retrieve task data from taskExists middleware
  const { task } = req;

  // Retrieve data from req body
  const { name, description, due_date, is_completed } = req.body;

  // Update task
  await task.update({ name, description, due_date, is_completed });

  // Send success response
  res.status(200).json({ status: 'success' });
});

const deleteTask = catchAsync(async (req, res, next) => {
  // Retrieve task data from taskExists middleware
  const { task } = req;

  // Soft-delete record
  await task.update({ status: 'inactive' });

  // Send success response
  res.status(200).json({ status: 'success' });
});

module.exports = {
  createTask,
  getTaskInfo,
  completeTask,
  updateTask,
  deleteTask,
};
