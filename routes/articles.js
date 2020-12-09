const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles.js');

router.get('/articles', getArticles);
router.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().uri(),
      image: Joi.string().required().uri(),
    }),
  }),
  createArticle,
);
router.delete(
  '/articles/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  deleteArticle,
);

module.exports = router;
