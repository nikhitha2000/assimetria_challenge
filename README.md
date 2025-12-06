# Auto-Generated Blog - Full-Stack Technical Challenge

A full-stack blog application with AI-powered article generation, deployed on AWS using Docker containers.

## 📋 Project Overview

This application automatically generates blog articles daily using AI and displays them through a React frontend. The backend runs on Node.js with Express, stores data in PostgreSQL, and uses HuggingFace Inference API for free article generation.

## 🏗️ Architecture

- **Frontend**: React application (Dockerized)
- **Backend**: Node.js + Express API (Dockerized)
- **Database**: PostgreSQL
- **AI**: HuggingFace Inference API (Free)
- **Deployment**: AWS EC2 + ECR + CodeBuild
- **Scheduling**: node-cron for daily article generation

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker Compose)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd assimetria
   ```

2. **Set up environment variables**
   ```bash
   # Backend .env
   cd backend
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api/articles

### Manual Setup (Without Docker)

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   - Create PostgreSQL database
   - Update backend/.env with connection details
   - Run migrations: `npm run migrate`

## 📁 Project Structure

```
.
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── index.js     # Express server
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── models/      # Database models
│   │   └── db/          # Database connection
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── api/         # API client
│   ├── Dockerfile
│   └── package.json
├── infra/                # Infrastructure configs
│   ├── buildspec.yml    # AWS CodeBuild config
│   ├── docker-compose.yml
│   └── scripts/         # Deployment scripts
└── docs/                 # Documentation
```

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=postgres
HUGGINGFACE_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚢 AWS Deployment

See `docs/DEPLOYMENT.md` for detailed AWS deployment instructions.

### Quick Deployment Steps

1. **Push code to GitHub**

2. **Set up AWS ECR**
   - Create ECR repositories for frontend and backend

3. **Configure CodeBuild**
   - Use `infra/buildspec.yml`
   - Set environment variables in CodeBuild project

4. **Deploy to EC2**
   - Use deployment scripts in `infra/scripts/`

## 📝 API Endpoints

- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/generate` - Manually generate article (admin)

## 🎯 Features

- ✅ Automatic daily article generation
- ✅ AI-powered content creation (HuggingFace)
- ✅ React frontend with article listing and detail views
- ✅ RESTful API backend
- ✅ PostgreSQL database
- ✅ Docker containerization
- ✅ AWS deployment pipeline (EC2 + ECR + CodeBuild)

## 📚 Documentation

- [Architecture Details](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)

## 👤 Author

Built for Assimetria Technical Challenge


