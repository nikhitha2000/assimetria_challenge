const { pool } = require('../db/connection');

class Article {
  // Get all articles
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, title, excerpt, created_at, updated_at
      FROM articles
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Get article by ID
  static async findById(id) {
    const query = `
      SELECT id, title, content, excerpt, created_at, updated_at
      FROM articles
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Create new article
  static async create({ title, content, excerpt }) {
    const query = `
      INSERT INTO articles (title, content, excerpt, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, title, excerpt, created_at, updated_at
    `;
    const result = await pool.query(query, [title, content, excerpt || content.substring(0, 200) + '...']);
    return result.rows[0];
  }

  // Count total articles
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM articles');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Article;


