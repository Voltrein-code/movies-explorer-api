const router = require('express').Router();
const auth = require('../midllewares/auth');
const errorRouter = require('./error');

const { routesWithAuthValidation, signinValidation, signupValidation } = require('../midllewares/validation');
const { login, createUser } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадет');
  }, 0);
});

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

router.use('/users', routesWithAuthValidation, auth, require('./users'));
router.use('/movies', routesWithAuthValidation, auth, require('./movies'));

router.use('/', errorRouter);

module.exports = router;
