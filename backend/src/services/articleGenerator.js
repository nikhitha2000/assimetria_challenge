require("dotenv").config();
const AIClient = require("./aiClient");
const Article = require("../models/Article"); // Your PostgreSQL model

class ArticleGenerator {
  constructor() {
    console.log(
      "DEBUG: ArticleGenerator sees HUGGINGFACE_API_KEY =",
      process.env.HUGGINGFACE_API_KEY ? "[SET]" : "[NOT SET]"
    );
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.warn(
        "⚠️ HUGGINGFACE_API_KEY not set. Will use fallback articles."
      );
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
      console.log("📝 Starting article generation...");
      let articleToSave; // The single article object we will save
      if (this.aiClient) {
        // Try to generate using AI
        try {
          const result = await this.aiClient.generateArticle(topic);

          // Check if AI succeeded or failed and returned fallback content
          if (result.newArticle) {
            // SUCCESS: Use the generated article
            articleToSave = result.newArticle;
          } else if (
            result.fallbackArticles &&
            result.fallbackArticles.length > 0
          ) {
            // Use the last fallback article if generation failed
            articleToSave =
              result.fallbackArticles[result.fallbackArticles.length - 1];
          } else {
            // Fallback to the generic error message if result is empty
            throw new Error("AI Client returned empty data.");
          }
        } catch (error) {
          console.error(
            "❌ AI generation failed, using fallback:",
            error.message
          ); 
          // Recreate a generic failure article using the simplest format
          articleToSave = {
            title: "AI Service Offline or Unauthorized",
            content: `Article generation failed due to a fatal error (${error.message}). Check API key and network status.`,
            excerpt: "Generation failed.",
          };
        }
      } else {
        
        console.log("⚠️ No API key configured, using generic fallback article");
        // Get fallback article (assuming getFallbackArticle returns an array, and you want the last one)
        articleToSave = new AIClient(null).getFallbackArticle().pop();
      } 

      const article = await Article.create(articleToSave);
      console.log(
        `✅ Article generated successfully: "${article.title}" (ID: ${article.id})`
      );
      return article;
    } catch (error) {
      console.error("❌ Error generating article:", error);
      throw error;
    }
  }

  /**
   * Ensures a minimum number of articles exist by generating new ones if necessary.
   * FIX: Calls Article.count() directly.
   */
  async ensureMinimumArticles(requiredCount) {
    // FIX: Call the static count method from your Article Model
    let currentCount = await Article.count(); 
    let articlesToGenerate = requiredCount - currentCount;

    console.log(`Need to generate ${articlesToGenerate} unique articles.`);

    // Loop and generate unique articles until the minimum is met
    for (let i = 0; i < articlesToGenerate; i++) {
      // This ensures a unique article is generated per iteration.
      await this.generateAndSave(); 
      console.log(`Generated and saved article ${i + 1} of ${articlesToGenerate}.`);
    }
  }
}

module.exports = ArticleGenerator;