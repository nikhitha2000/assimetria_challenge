require("dotenv").config();
const AIClient = require("./aiClient");
const Article = require("../models/Article");

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
          // 🛑 AIClient now returns { newArticle, fallbackArticles }
          const result = await this.aiClient.generateArticle(topic);

          // Check if AI succeeded or failed and returned fallback content
          if (result.newArticle) {
            // SUCCESS: Use the generated article
            articleToSave = result.newArticle;
          } else if (
            result.fallbackArticles &&
            result.fallbackArticles.length > 0
          ) {
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
          ); // 🛑 Hard fallback for non-503 errors (e.g., 401, network issue) 🛑
          // Recreate a generic failure article using the simplest format
          articleToSave = {
            title: "AI Service Offline or Unauthorized",
            content: `Article generation failed due to a fatal error (${error.message}). Check API key and network status.`,
            excerpt: "Generation failed.",
          };
        }
      } else {
       
        console.log("⚠️ No API key configured, using generic fallback article");
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

  async ensureMinimumArticles(count = 3) {
    try {
      const currentCount = await Article.count();
      const needed = Math.max(0, count - currentCount);
      if (needed > 0) {
        console.log(`📚 Generating ${needed} initial articles...`);
        for (let i = 0; i < needed; i++) {
          await this.generateAndSave(); 
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        console.log(`✅ Generated ${needed} initial articles`);
      }
    } catch (error) {
      console.error("❌ Error ensuring minimum articles:", error);
    }
  }
}

module.exports = ArticleGenerator;
