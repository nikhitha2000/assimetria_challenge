require('dotenv').config();
const AIClient = require('./aiClient');
const Article = require('../models/Article');

class ArticleGenerator {
  constructor() {
    console.log('DEBUG: ArticleGenerator sees HUGGINGFACE_API_KEY =', process.env.HUGGINGFACE_API_KEY ? '[SET]' : '[NOT SET]');
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ HUGGINGFACE_API_KEY not set. Will use fallback articles.');
      this.aiClient = null;
    } else {
      this.aiClient = new AIClient(apiKey);
    }
  }

  /**
   * Generate and save a new article
   */
  async generateAndSave(topic = null) {
    try {
      console.log('📝 Starting article generation...');
      
      let articleData;
      
      if (this.aiClient) {
        // Try to generate using AI
        try {
          articleData = await this.aiClient.generateArticle(topic);
        } catch (error) {
          console.error('❌ AI generation failed, using fallback:', error.message);
          // Use fallback article
          articleData = this.aiClient.getFallbackArticle();
        }
      } else {
        // No API key, use fallback
        console.log('⚠️ No API key configured, using fallback article');
        articleData = new AIClient(null).getFallbackArticle();
      }

      // Save to database
      const article = await Article.create(articleData);
      
      console.log(`✅ Article generated successfully: "${article.title}" (ID: ${article.id})`);
      
      return article;
    } catch (error) {
      console.error('❌ Error generating article:', error);
      throw error;
    }
  }

  /**
   * Ensure we have at least N articles in the database
   */
  async ensureMinimumArticles(count = 3) {
    try {
      const currentCount = await Article.count();
      const needed = Math.max(0, count - currentCount);
      
      if (needed > 0) {
        console.log(`📚 Generating ${needed} initial articles...`);
        
        for (let i = 0; i < needed; i++) {
          await this.generateAndSave();
          // Small delay between generations to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log(`✅ Generated ${needed} initial articles`);
      }
    } catch (error) {
      console.error('❌ Error ensuring minimum articles:', error);
    }
  }
}

module.exports = ArticleGenerator;


