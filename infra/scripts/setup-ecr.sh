#!/bin/bash

# Script to create ECR repositories
# Run this once to set up ECR repositories for the blog application

set -e

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🔧 Setting up ECR repositories..."
echo "📍 Region: $AWS_REGION"
echo "🆔 Account ID: $AWS_ACCOUNT_ID"

# Create backend repository
echo "📦 Creating backend repository..."
aws ecr create-repository \
  --repository-name blog-backend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE \
  2>/dev/null || echo "Repository blog-backend already exists"

# Create frontend repository
echo "📦 Creating frontend repository..."
aws ecr create-repository \
  --repository-name blog-frontend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE \
  2>/dev/null || echo "Repository blog-frontend already exists"

echo ""
echo "✅ ECR repositories created successfully!"
echo ""
echo "📋 Repository URIs:"
echo "Backend:  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-backend"
echo "Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-frontend"
echo ""
echo "📝 Update buildspec.yml with your AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"



