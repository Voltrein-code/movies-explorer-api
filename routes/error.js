const router = require('express').Router();

const NotFoundError = require('../errors/not-found-error');

// eslint-disable-next-line no-unused-vars
router.all('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
