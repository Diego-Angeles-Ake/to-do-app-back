const express = require('express');

// Domain access
const cors = require('cors');

// Production utilities
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Calls limiter
const { apiLimiter } = require('./helpers/api-limiter.helper');

// Routers
const { usersRouter } = require('./routes/user.route');
const { tasksRouter } = require('./routes/task.route');

// Error handler
const { globalErrorHandler } = require('./controllers/error.controller');

// Instance app
const app = express();

// Enable CORS
app.use(cors());

// Enable JSON
app.use(express.json());

// Enable security headers
app.use(helmet());

// Compress responses
app.use(compression());

//Log incoming requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Apply the rate limiting middleware
app.use(apiLimiter);

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tasks', tasksRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
