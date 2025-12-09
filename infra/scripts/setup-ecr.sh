#!/bin/bash
# --- setup-ecr.sh ---

# Exit immediately if a command exits with a non-zero status
set -e

# --- 1. Define Variables ---
REGION="ap-south-1" # Based on your previous ECR URL
ACCOUNT_ID="021916846840"
REPO_BACKEND="blog-backend"
REPO_FRONTEND="blog-frontend"

# --- 2. Create Repositories (if necessary) ---
echo "Checking and creating ECR repositories..."

# Create Backend Repo
aws ecr describe-repositories --repository-names $REPO_BACKEND --region $REGION || \
aws ecr create-repository --repository-name $REPO_BACKEND --region $REGION > /dev/null

# Create Frontend Repo
aws ecr describe-repositories --repository-names $REPO_FRONTEND --region $REGION || \
aws ecr create-repository --repository-name $REPO_FRONTEND --region $REGION > /dev/null

# --- 3. Authenticate Docker with ECR ---
echo "Authenticating Docker with ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "ECR setup complete. Repositories created and Docker authenticated."