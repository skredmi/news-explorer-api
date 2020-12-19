const router = require('express').Router();
const { validateArticle, validateArticleId } = require('../utils/validaton');

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles.js');

router.get('/articles', getArticles);
router.post('/articles', validateArticle, createArticle);
router.delete('/articles/:id', validateArticleId, deleteArticle);

module.exports = router;
