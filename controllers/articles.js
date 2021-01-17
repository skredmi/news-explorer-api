const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const { INVALID_DATA_ERROR, FORBIDDEN_DELETE_ERROR, CARD_NOT_FOUND_ERROR } = require('../utils/errors');

const getArticles = (req, res, next) => {
  Article.find({}).select('+owner')
    .then((data) => res.send(data))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword, title, text, date, source, link, image, owner: _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(INVALID_DATA_ERROR);
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError(CARD_NOT_FOUND_ERROR);
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_DELETE_ERROR);
      }
      return Article.findByIdAndRemove(req.params.id)
        .then((cardData) => res.send({ data: cardData }));
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
