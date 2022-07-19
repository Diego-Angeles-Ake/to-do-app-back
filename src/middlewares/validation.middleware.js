const { body, validationResult } = require('express-validator');
const AppError = require('../helpers/app-error.helper');

const signUpValidations = [
  body('username').notEmpty().withMessage('Must provide a name'),
  body('email').notEmpty().isEmail().withMessage('Must provide a valid email'),
  body('password')
    .notEmpty()
    .isStrongPassword({ minSymbols: 0 })
    .withMessage(
      'Must provide a password with a minimum length of 8 characters, 1 uppercase character and 1 lowercase character'
    ),
  body('role')
    .default('normal')
    .isIn(['admin', 'normal'])
    .notEmpty()
    .withMessage('Must provide a valid role'),
];

const loginValidations = [
  body('email').notEmpty().withMessage('Must provide an email'),
  body('password').notEmpty().withMessage('Must provide a password'),
];

const createTaskValidations = [
  body('name')
    .notEmpty()
    .withMessage('Must provide a task name')
    .isLength({ max: 100 })
    .withMessage('Max task name length is 100 characters '),
  body('description')
    .optional()
    .isLength({ max: 280 })
    .withMessage('Max description length is 280 characters'),
  body('due_date')
    .notEmpty()
    .withMessage('Must provide a date')
    .isDate()
    .withMessage('Must be a date timestamp'),
];

const updateTaskValidations = [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Max task name length is 100 characters '),
  body('description')
    .optional()
    .isLength({ max: 280 })
    .withMessage('Max description length is 280 characters'),
  body('due_date').optional().isDate().withMessage('Must be a date timestamp'),
  body('is_completed').optional().isBoolean().withMessage('Must be a boolean'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('.\n');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  signUpValidations,
  loginValidations,
  createTaskValidations,
  updateTaskValidations,
  checkValidations,
};
