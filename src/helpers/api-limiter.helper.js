const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests',
});

module.exports = { apiLimiter };
