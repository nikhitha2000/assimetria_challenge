require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDB } = require('./db/connection');
const articleRoutes = require('./routes/articles');
const { startScheduler } = require('./services/articleScheduler');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/articles', articleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection and tables
    await initializeDB();
    console.log('✅ Database initialized');

    // Start the article generation scheduler
    startScheduler();
    console.log('✅ Article scheduler started');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api/articles`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();


