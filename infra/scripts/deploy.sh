#!/bin/bash
# --- deploy.sh ---

# Exit immediately if a command exits with a non-zero status
set -e

# --- 1. Define Variables ---
REGION="ap-south-1" 
ACCOUNT_ID="021916846840" 
COMPOSE_FILE="docker-compose.yml" 
# Assuming environment variables (like HUGGINGFACE_API_KEY) are sourced from an .env file or passed in

echo "Starting deployment process..."

# --- 2. Authenticate Docker with ECR ---
echo "Authenticating Docker with ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# --- 3. Pull Latest Images ---
echo "Pulling latest images from ECR..."
# This command pulls images that are explicitly tagged in the compose file or referenced in the ECR
docker compose pull 

# --- 4. Deploy and Start Containers ---
echo "Starting and updating containers..."
# -d: detached mode
# --force-recreate: ensures containers restart even if the image tag is the same
docker compose up -d --force-recreate

echo "Deployment complete. Application is running on EC2."