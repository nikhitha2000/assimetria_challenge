# Architecture Documentation

## System Overview

This auto-generated blog application is a full-stack application that automatically generates blog articles daily using AI and displays them through a web interface.

## Architecture Diagram

```
┌─────────────────┐
│   React App     │ (Frontend - Port 80/3000)
│   (Nginx)       │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Node.js/Express│ (Backend - Port 5000)
│     API         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────────┐
│PostgreSQL│ │HuggingFace│
│ Database │ │    API    │
└─────────┘ └────────────┘
```

## Components

### 1. Frontend (React)

**Technology Stack:**
- React 18
- React Router for navigation
- Axios for API calls
- Nginx for serving static files in production

**Responsibilities:**
- Display list of articles
- Display individual article details
- Handle routing between pages
- User interface and experience

**Container:**
- Built as multi-stage Docker build
- Served via Nginx in production
- Exposed on port 80 (or 3000 in development)

### 2. Backend (Node.js/Express)

**Technology Stack:**
- Node.js 18
- Express.js for REST API
- PostgreSQL client (pg)
- node-cron for scheduling
- Axios for external API calls

**Responsibilities:**
- RESTful API endpoints
- Database operations (CRUD)
- AI article generation orchestration
- Daily article generation scheduling
- Data persistence

**API Endpoints:**
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/generate` - Manually generate article
- `GET /health` - Health check

**Container:**
- Single-stage Docker build
- Exposed on port 5000

### 3. Database (PostgreSQL)

**Technology Stack:**
- PostgreSQL 15

**Schema:**
```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Index on `created_at` for efficient ordering

### 4. AI Service (HuggingFace)

**Technology Stack:**
- HuggingFace Inference API (Free tier)
- GPT-2 model (free, no GPU required)

**Fallback Mechanism:**
- If API fails or is unavailable, system uses predefined fallback articles
- Ensures application continues to function even without API access

## Data Flow

### Article Generation Flow

1. **Scheduled Trigger** (Daily at 2:00 AM UTC)
   - node-cron triggers article generation
   - `ArticleGenerator` service is invoked

2. **AI Generation**
   - `AIClient` makes request to HuggingFace API
   - AI model generates article content based on random prompt
   - Content is formatted into article structure

3. **Persistence**
   - Generated article is saved to PostgreSQL
   - Article becomes immediately available via API

### Article Retrieval Flow

1. **User Request**
   - User visits frontend
   - React app makes API call to backend

2. **API Processing**
   - Express routes handle request
   - Database query retrieves articles
   - JSON response sent to frontend

3. **Display**
   - React components render articles
   - User can view list or individual articles

## Deployment Architecture

### AWS Infrastructure

```
GitHub Repository
    │
    │ (Code Push)
    ▼
AWS CodeBuild
    │
    │ (Builds & Pushes)
    ▼
AWS ECR
    │
    │ (Pulls Images)
    ▼
AWS EC2 Instance
    ├── Frontend Container (Nginx)
    ├── Backend Container (Node.js)
    └── PostgreSQL Container
```

### CI/CD Pipeline

1. **Source**: Code pushed to GitHub
2. **Build**: CodeBuild executes `buildspec.yml`
   - Builds Docker images for frontend and backend
   - Pushes images to ECR
3. **Deploy**: Manual or automated deployment to EC2
   - Pulls latest images from ECR
   - Restarts containers with new images

## Security Considerations

- Environment variables for sensitive data (API keys, DB passwords)
- CORS configured for frontend domain
- SQL injection protection via parameterized queries
- Docker containers run with non-root users where possible
- Health checks for container monitoring

## Scalability Considerations

**Current Design:**
- Single EC2 instance
- Single PostgreSQL instance
- Suitable for low to moderate traffic

**Future Improvements:**
- Load balancer for multiple EC2 instances
- RDS for managed PostgreSQL
- Redis cache for frequently accessed articles
- CDN for static frontend assets
- Horizontal scaling of backend containers

## Monitoring & Observability

- Health check endpoints (`/health`)
- Docker health checks
- Console logging for debugging
- Error handling middleware

## Cost Optimization

- Free-tier HuggingFace API (no cost)
- EC2 free tier eligible instance types
- ECR storage minimal cost
- CodeBuild pay-per-use (minimal for small projects)


