const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request_error');
const ForbiddenError = require('../errors/forbidden-error');
const { errorMessages } = require('../constans/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.createMovieValidationError));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => new NotFoundError(errorMessages.movieNotFoundError))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(errorMessages.deleteMovieForbiddenError);
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((movieForRemove) => res.status(200).send(movieForRemove))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.deleteMovieCastError));
        return;
      }
      next(err);
    });
};
