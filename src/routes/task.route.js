const express = require('express');

// Middlewares
const { protectToken } = require('../middlewares/user.middleware');
const {
  taskExists,
  ownerAuth,
  taskOwnerAuth,
} = require('../middlewares/task.middleware');
const {
  createTaskValidations,
  updateTaskValidations,
  checkValidations,
} = require('../middlewares/validation.middleware');

// Controllers
const {
  createTask,
  getTaskInfo,
  completeTask,
  deleteTask,
  updateTask,
} = require('../controllers/task.controller');

const router = express.Router();

// Protected routes
router.use(protectToken);
router.post('/', createTaskValidations, checkValidations, createTask);
router
  .route('/:id')
  .get(taskExists, taskOwnerAuth, getTaskInfo)
  .post(taskExists, taskOwnerAuth, completeTask)
  .patch(
    taskExists,
    taskOwnerAuth,
    updateTaskValidations,
    checkValidations,
    updateTask
  )
  .delete(taskExists, taskOwnerAuth, deleteTask);

module.exports = { tasksRouter: router };
