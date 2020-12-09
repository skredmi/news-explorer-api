const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR } = require('../utils/errors');

router.all('*', () => {
  throw new NotFoundError(NOT_FOUND_ERROR);
});

module.exports = router;
