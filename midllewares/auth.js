const jwt = require('jsonwebtoken');

require('dotenv').config();

const UnauthorizedError = require('../errors/unauthorized-error');
const { errorMessages } = require('../constans/constants');

const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../constans/config');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(errorMessages.authError));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(errorMessages.authError));
  }

  req.user = payload;

  return next();
};
