const axios = require('axios');

class AIClient {
  constructor(apiKey) {
    console.log('DEBUG: AIClient constructed with apiKey =', apiKey ? '[RECEIVED]' : '[NO KEY]');
    this.apiKey = apiKey;
    this.baseURL = 'https://api-inference.huggingface.co/models';
    
    this.model = 'gpt2'; 
  }

 
  async generateArticle(topic = null) {
    try {
      // If no topic provided, use a default prompt
      const prompt = topic || this.getRandomPrompt();
      
      console.log(`🤖 Generating article with prompt: "${prompt.substring(0, 50)}..."`);

      const response = await axios.post(
        `${this.baseURL}/${this.model}`,
        {
          inputs: prompt,
          parameters: {
            max_length: 400, // Generate reasonable length content
            temperature: 0.9,
            top_p: 0.9,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data && response.data[0] && response.data[0].generated_text) {
        const generatedText = response.data[0].generated_text;
        
        // Format the generated text into article structure
        return this.formatArticle(generatedText, prompt);
      } else {
        throw new Error('Invalid response from AI API');
      }
    } catch (error) {
      console.error('❌ AI generation error:', error.message);
      
      // Fallback to a simple generated article if API fails
      if (error.response?.status === 503) {
        console.log('⚠️ Model is loading, using fallback content');
        return this.getFallbackArticle();
      }
      
      throw error;
    }
  }

  /**
   * Get a random prompt for article generation
   */
  getRandomPrompt() {
    const prompts = [
      'The future of technology in everyday life',
      'Understanding artificial intelligence and machine learning',
      'Sustainable living and environmental conservation',
      'The impact of social media on society',
      'Remote work culture and productivity',
      'Innovations in healthcare technology',
      'The evolution of programming languages',
      'Cybersecurity best practices for individuals',
      'The rise of electric vehicles',
      'Mental health awareness in the digital age',
      'Open source software and community',
      'Renewable energy solutions',
      'Data privacy in the modern world',
      'The art of effective communication',
      'Entrepreneurship and startup culture'
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  /**
   * Format generated text into a proper article structure
   */
  formatArticle(content, prompt) {
    // Clean up the content
    let cleanedContent = content.trim();
    
    // Ensure it has proper paragraphs
    if (!cleanedContent.includes('\n')) {
      // Split into sentences and create paragraphs
      const sentences = cleanedContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 3) {
        paragraphs.push(sentences.slice(i, i + 3).join('. ') + '.');
      }
      cleanedContent = paragraphs.join('\n\n');
    }

    // Generate title from prompt
    const title = this.generateTitle(prompt);
    
    // Create excerpt (first 200 chars)
    const excerpt = cleanedContent.substring(0, 200).replace(/\n/g, ' ').trim() + '...';

    return {
      title,
      content: cleanedContent,
      excerpt
    };
  }

  /**
   * Generate a title from the prompt
   */
  generateTitle(prompt) {
    // Simple title generation - capitalize and format
    return prompt
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Fallback article in case API fails
   */
  getFallbackArticle() {
    const topics = [
      {
        title: 'The Future of Technology',
        content: `Technology continues to evolve at an unprecedented pace, shaping the way we live, work, and interact with the world around us. From artificial intelligence to renewable energy, innovations are transforming every aspect of our daily lives.

In recent years, we've witnessed remarkable advances in computing power, connectivity, and automation. These developments promise to solve complex challenges while also raising important questions about ethics, privacy, and the future of human employment.

As we move forward, it's crucial to balance technological progress with thoughtful consideration of its implications. The key to harnessing technology's full potential lies in understanding both its capabilities and its limitations.

Whether you're a developer, entrepreneur, or simply someone curious about the future, staying informed about technological trends is more important than ever.`,
        excerpt: 'Technology continues to evolve at an unprecedented pace, shaping the way we live, work, and interact...'
      },
      {
        title: 'Understanding Modern Web Development',
        content: `Web development has come a long way since the early days of static HTML pages. Today's web applications are complex, interactive, and capable of delivering experiences that rival native applications.

Modern frameworks and tools have democratized web development, making it accessible to developers of all skill levels. React, Vue, and Angular have revolutionized how we build user interfaces, while Node.js has unified JavaScript across both client and server.

The rise of cloud computing and containerization has also transformed deployment practices. Docker and Kubernetes have made it easier than ever to build, ship, and scale applications reliably.

Looking ahead, we can expect even more exciting developments in web technology, from improved performance to new capabilities in areas like WebAssembly and progressive web apps.`,
        excerpt: 'Web development has come a long way since the early days of static HTML pages. Today\'s web applications...'
      },
      {
        title: 'The Importance of Sustainable Practices',
        content: `Sustainability is no longer a niche concern but a critical imperative for businesses, communities, and individuals worldwide. As we face the realities of climate change and resource depletion, adopting sustainable practices has become essential.

From reducing carbon footprints to implementing circular economy principles, there are countless ways organizations and individuals can contribute to a more sustainable future. Renewable energy, waste reduction, and ethical sourcing are just a few areas where meaningful progress can be made.

Technology plays a crucial role in enabling sustainability. Smart grids, energy-efficient systems, and data analytics help optimize resource usage and identify opportunities for improvement.

Ultimately, sustainability is about creating systems that can thrive long-term without depleting the resources future generations will need. It's a challenge that requires collaboration, innovation, and commitment from all sectors of society.`,
        excerpt: 'Sustainability is no longer a niche concern but a critical imperative for businesses, communities...'
      }
    ];

    return topics[Math.floor(Math.random() * topics.length)];
  }
}

module.exports = AIClient;


