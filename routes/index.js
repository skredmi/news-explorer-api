const router = require('express').Router();
const userRoutes = require('./users.js');
const articleRoutes = require('./articles.js');
const errorRoutes = require('./error.js');

router.use('/', userRoutes);
router.use('/', articleRoutes);
router.use('/', errorRoutes);

module.exports = router;
