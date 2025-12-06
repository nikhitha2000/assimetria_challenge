const cron = require('node-cron');
const ArticleGenerator = require('./articleGenerator');

let generator = null;
let scheduledJob = null;

/**
 * Start the article generation scheduler
 * Generates one article per day at 2 AM UTC
 */
function startScheduler() {
  if (scheduledJob) {
    console.log('⚠️ Scheduler already started');
    return;
  }

  generator = new ArticleGenerator();

  // Generate one article per day at 2:00 AM UTC
  // Cron format: minute hour day month day-of-week
  scheduledJob = cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Daily article generation triggered');
    try {
      await generator.generateAndSave();
      console.log('✅ Daily article generated successfully');
    } catch (error) {
      console.error('❌ Failed to generate daily article:', error);
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('✅ Article scheduler configured (daily at 2:00 AM UTC)');

  // Ensure we have at least 3 articles on startup
  generator.ensureMinimumArticles(3).catch(err => {
    console.error('❌ Error ensuring minimum articles:', err);
  });
}

/**
 * Manually trigger article generation (for testing)
 */
async function generateNow() {
  if (!generator) {
    generator = new ArticleGenerator();
  }
  return await generator.generateAndSave();
}

module.exports = {
  startScheduler,
  generateNow
};


