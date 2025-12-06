# Blog Backend

Node.js/Express backend API for the auto-generated blog application.

## Features

- RESTful API for article management
- PostgreSQL database integration
- AI-powered article generation using HuggingFace API
- Automatic daily article generation (node-cron)
- Docker containerization

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL:**
   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_DB=blog_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:15-alpine
   ```

4. **Run migrations:**
   ```bash
   npm run migrate
   ```

5. **Start server:**
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production mode
   ```

### Docker

```bash
docker build -t blog-backend .
docker run -p 5000:5000 \
  -e DB_HOST=postgres \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e HUGGINGFACE_API_KEY=your-key \
  blog-backend
```

## Environment Variables

See `.env.example` for all available environment variables.

## API Endpoints

- `GET /health` - Health check
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/generate` - Generate new article

See `docs/API.md` for detailed API documentation.

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Express app entry point
│   ├── db/
│   │   └── connection.js     # PostgreSQL connection
│   ├── models/
│   │   └── Article.js        # Article data model
│   ├── routes/
│   │   └── articles.js       # Article routes
│   └── services/
│       ├── aiClient.js       # HuggingFace API client
│       ├── articleGenerator.js  # Article generation logic
│       └── articleScheduler.js  # Daily scheduling
├── Dockerfile
└── package.json
```

## Scheduling

Articles are automatically generated daily at 2:00 AM UTC using node-cron.

To generate an article manually:
```bash
curl -X POST http://localhost:5000/api/articles/generate
```

## AI Integration

Uses HuggingFace Inference API (free tier) with GPT-2 model. Falls back to predefined articles if API is unavailable.

Get your free API key at: https://huggingface.co/settings/tokens


