const { HfInference } = require("@huggingface/inference");

class AIClient {
  constructor(apiKey) {
    console.log(
      "DEBUG: AIClient constructed with apiKey =",
      apiKey ? "[RECEIVED]" : "[NO KEY]"
    );
    if (!apiKey) {
      console.error(
        "FATAL: AIClient initialized without an API key. API calls will fail."
      );
    }
    this.apiKey = apiKey;
    this.hf = new HfInference(apiKey);
    this.model = "facebook/bart-large-cnn";

    // 🛑 Added property to store the full fallback list internally 🛑
    this.fallbackTopics = this._getStaticFallbackTopics();
    // 🛑 Added property to track titles already used by the AI to prevent new generated articles from repeating static titles 🛑
    this.usedTitles = new Set(this.fallbackTopics.map((t) => t.title));
  }
  async generateArticle(topic = null) {
    const GENERATION_PARAMS = {
      max_length: 400,
      min_length: 150,
      temperature: 0.9,
      top_p: 0.9,
    };
    try {
      const prompt = topic || this.getRandomPrompt();
      console.log(
        `🤖 Generating article with prompt: "${prompt.substring(0, 50)}..."`
      );

      const response = await this.hf.summarization({
        model: this.model,
        inputs: prompt,
        parameters: GENERATION_PARAMS,
      });

      if (response && response.summary_text) {
        let newArticle = this.formatArticle(response.summary_text, prompt);

        // 🛑 Deduplication check for the new generated article 🛑
        // If the generated title already exists in the static list, append a unique marker.
        if (this.usedTitles.has(newArticle.title)) {
          newArticle.title = newArticle.title + " (AI)";
        }

        // Add the new title to the used set
        this.usedTitles.add(newArticle.title);

        // 🛑 Return the new article and the static articles (excluding the new one if its title matched a static one) 🛑
        return {
          newArticle: newArticle,
          fallbackArticles: this.fallbackTopics,
        };
      } else {
        throw new Error("Invalid response format from AI API");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 503) {
        console.log(
          "⚠️ Model is loading or unavailable, returning only fallback content."
        ); // 🛑 On failure, only return the static fallback list 🛑
        return { newArticle: null, fallbackArticles: this.fallbackTopics };
      }
      console.error("❌ AI generation error:", error.message);
      throw error;
    }
  }

  // 🛑 NEW METHOD: Internal function to define the static list 🛑
  _getStaticFallbackTopics() {
    return [
      {
        title: "The Future of Technology",
        content: `Technology continues to evolve at an unprecedented pace, shaping the way we live, work, and interact with the world around us. From artificial intelligence to renewable energy, innovations are transforming every aspect of our daily lives. In recent years, we've witnessed remarkable advances in computing power, connectivity, and automation. These developments promise to solve complex challenges while also raising important questions about ethics, privacy, and the future of human employment. As we move forward, it's crucial to balance technological progress with thoughtful consideration of its implications. The key to harnessing technology's full potential lies in understanding both its capabilities and its limitations. Whether you're a developer, entrepreneur, or simply someone curious about the future, staying informed about technological trends is more important than ever.`,
        excerpt:
          "Technology continues to evolve at an unprecedented pace, shaping the way we live, work, and interact...",
      },
      {
        title: "Understanding Modern Web Development",
        content: `Web development has come a long way since the early days of static HTML pages. Today's web applications are complex, interactive, and capable of delivering experiences that rival native applications. Modern frameworks and tools have democratized web development, making it accessible to developers of all skill levels. React, Vue, and Angular have revolutionized how we build user interfaces, while Node.js has unified JavaScript across both client and server. The rise of cloud computing and containerization has also transformed deployment practices. Docker and Kubernetes have made it easier than ever to build, ship, and scale applications reliably. Looking ahead, we can expect even more exciting developments in web technology, from improved performance to new capabilities in areas like WebAssembly and progressive web apps.`,
        excerpt:
          "Web development has come a long way since the early days of static HTML pages. Today's web applications...",
      },
      {
        title: "The Importance of Sustainable Practices",
        content: `Sustainability is no longer a niche concern but a critical imperative for businesses, communities, and individuals worldwide. As we face the realities of climate change and resource depletion, adopting sustainable practices has become essential. From reducing carbon footprints to implementing circular economy principles, there are countless ways organizations and individuals can contribute to a more sustainable future. Renewable energy, waste reduction, and ethical sourcing are just a few areas where meaningful progress can be made. Technology plays a crucial role in enabling sustainability. Smart grids, energy-efficient systems, and data analytics help optimize resource usage and identify opportunities for improvement. Ultimately, sustainability is about creating systems that can thrive long-term without depleting the resources future generations will need. It's a challenge that requires collaboration, innovation, and commitment from all sectors of society.`,
        excerpt:
          "Sustainability is no longer a niche concern but a critical imperative for businesses, communities...",
      },
      {
        title: "The Shift to Microservices Architecture",
        content:
          "The way we design and deploy software is fundamentally changing, moving away from monolithic applications toward microservices architecture. This approach structures a single application as a collection of smaller, independently deployable services, each running its own process and communicating via lightweight mechanisms, often an HTTP API.This architectural shift offers several compelling advantages, including scalability, as individual services can be scaled independently based on demand, and agility, allowing teams to develop, deploy, and update services without affecting the entire application. The choice of technology is also decoupled; different services can be written in different programming languages that are best suited for their specific function.However, microservices introduce new challenges, primarily related to distributed systems, such as service discovery, inter-service communication reliability, distributed transaction management, and centralized logging/monitoring. Tools like service meshes (e.g., Istio, Linkerd) and robust DevOps practices are essential to managing this complexity.",
        excerpt:
          "The way we design and deploy software is fundamentally changing, moving away from monolithic applications toward microservices architecture.",
      },
    ];
  }
  /**
   * Get a random prompt for article generation
   */
  getRandomPrompt() {
    const prompts = [
      "The future of technology in everyday life",
      "Understanding artificial intelligence and machine learning",
      "Sustainable living and environmental conservation",
      "The impact of social media on society",
      "Remote work culture and productivity",
      "Innovations in healthcare technology",
      "The evolution of programming languages",
      "Cybersecurity best practices for individuals",
      "The rise of electric vehicles",
      "Mental health awareness in the digital age",
      "Open source software and community",
      "Renewable energy solutions",
      "Data privacy in the modern world",
      "The art of effective communication",
      "Entrepreneurship and startup culture",
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
  /**
   * Format generated text into a proper article structure
   */

  formatArticle(content, prompt) {
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/\s+$/, ""); 
    if (!cleanedContent.includes("\n")) {
      const sentences = cleanedContent
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 3) {
        paragraphs.push(sentences.slice(i, i + 3).join(". ") + ".");
      }
      cleanedContent = paragraphs.join("\n\n");
    }

    const title = this.generateTitle(prompt);
    const excerpt =
      cleanedContent.substring(0, 200).replace(/\n/g, " ").trim() + "...";

    return {
      title,
      content: cleanedContent,
      excerpt,
    };
  }
  /**
   * Generate a title from the prompt
   */

  generateTitle(prompt) {
    // Simple title generation - capitalize and format
    return prompt
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  /**
   * Fallback article logic is now managed internally.
   * This function is now just for defining the static list,
   * but is not called for returning fallback content directly.
   */

  getFallbackArticle() {
    return this.fallbackTopics;
  }
}

module.exports = AIClient;
