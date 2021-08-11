/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const URL_PATTERN = /^(http|https):\/\/(www\.)?[a-z\d\.\-_~:/?#\[\]@!$&'()\*\+,;=]+/;

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }).unknown(true),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(URL_PATTERN).required(),
    trailer: Joi.string().pattern(URL_PATTERN).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(URL_PATTERN).required(),
    movieId: Joi.number().required(),
  }),
});

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.routesWithAuthValidation = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
});
