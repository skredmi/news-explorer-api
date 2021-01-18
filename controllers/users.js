const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { DEV_KEY } = require('../utils/secret-key');
const { USER_NOT_FOUND_ERROR, EMAIL_EXIST_ERROR, WRONG_DATA_ERROR } = require('../utils/errors');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .populate('owner')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR);
      }
      res.send({ data: { email: user.email, name: user.name } });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(EMAIL_EXIST_ERROR);
      }
    })
    .catch(next);
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }).then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(WRONG_DATA_ERROR);
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_KEY, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  createUser,
  login,
};
