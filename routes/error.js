const router = require('express').Router();

const NotFoundError = require('../errors/not-found-error');
const { errorMessages } = require('../constans/constants');

// eslint-disable-next-line no-unused-vars
router.all('*', (req, res) => {
  throw new NotFoundError(errorMessages.universalNotFoundError);
});

module.exports = router;
