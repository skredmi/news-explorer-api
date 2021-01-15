const router = require('express').Router();
const auth = require('../middlewares/auth.js');
const userRoutes = require('./users.js');
const articleRoutes = require('./articles.js');
const errorRoutes = require('./error.js');
const { login, createUser } = require('../controllers/users.js');
const { validateLogin, validateRegister } = require('../utils/validaton');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);
router.use(auth);
router.use('/', userRoutes);
router.use('/', articleRoutes);
router.use('/', errorRoutes);

module.exports = router;
