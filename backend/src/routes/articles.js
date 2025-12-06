const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { generateNow } = require('../services/articleScheduler');

/**
 * GET /api/articles
 * List all articles (paginated)
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const articles = await Article.findAll(limit, offset);
    const total = await Article.count();

    res.json({
      articles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/articles/:id
 * Get a single article by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/articles/generate
 * Manually trigger article generation (for testing/admin)
 */
router.post('/generate', async (req, res, next) => {
  try {
    const topic = req.body.topic || null;
    const ArticleGenerator = require('../services/articleGenerator');
    const articleGenerator = new ArticleGenerator();
    
    const article = await articleGenerator.generateAndSave(topic);

    res.status(201).json({
      message: 'Article generated successfully',
      article
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

