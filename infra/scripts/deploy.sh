#!/bin/bash

# Deployment script for EC2 instance
# This script pulls the latest images from ECR and restarts containers

set -e

echo "🚀 Starting deployment..."

# Configuration (update these values)
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"  # Replace with your AWS Account ID
ECR_BACKEND_REPO="blog-backend"
ECR_FRONTEND_REPO="blog-frontend"

# Login to ECR
echo "📦 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Pull latest images
echo "⬇️ Pulling latest images..."
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker stop blog-backend blog-frontend 2>/dev/null || true
docker rm blog-backend blog-frontend 2>/dev/null || true

# Run backend container
echo "🔧 Starting backend container..."
docker run -d \
  --name blog-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=blog_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e HUGGINGFACE_API_KEY="${HUGGINGFACE_API_KEY}" \
  -e FRONTEND_URL=http://localhost:3000 \
  --network blog-network \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest

# Run frontend container
echo "🔧 Starting frontend container..."
docker run -d \
  --name blog-frontend \
  --restart unless-stopped \
  -p 80:80 \
  --network blog-network \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

echo "✅ Deployment completed!"
echo "📊 Checking container status..."
docker ps | grep -E "blog-backend|blog-frontend"



