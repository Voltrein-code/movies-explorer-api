const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 100 * 1000,
  max: 100,
});
