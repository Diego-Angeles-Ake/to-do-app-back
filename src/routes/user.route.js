const express = require('express');

// Middlewares
const {
  protectToken,
  userExists,
  ownerAuth,
} = require('../middlewares/user.middleware');
const {
  signUpValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validation.middleware');

// Controllers
const {
  signup,
  login,
  getUserCompletedTasks,
  getUserTasks,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const router = express.Router();

// Public routes
router.post('/', signUpValidations, checkValidations, signup);
router.post('/login', loginValidations, checkValidations, login);

// Protected routes
router.use(protectToken);

// User tasks
router.get('/tasks', getUserTasks);
router.get('/completed-tasks', getUserCompletedTasks);

// User modification
router
  .route('/:id')
  .patch(userExists, ownerAuth, updateUser)
  .delete(userExists, ownerAuth, deleteUser);

module.exports = { usersRouter: router };
