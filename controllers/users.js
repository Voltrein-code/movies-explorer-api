const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../constans/config');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request_error');
const ConflictError = require('../errors/conflict-error');
const { errorMessages } = require('../constans/constants');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(errorMessages.userNotFoundError))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.userCastError));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const options = { runValidators: true, new: true };

  User.findByIdAndUpdate(req.user._id, { email, name }, options)
    .orFail(() => new NotFoundError(errorMessages.userNotFoundError))
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.userUpdateValidationError));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => {
          res.status(200).send(Object.assign(user, { password: undefined }));
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(errorMessages.userCreateValidationError));
            return;
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictError(errorMessages.userCreateMongoError));
            return;
          }
          next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
