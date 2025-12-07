#!/bin/bash

# Initial setup script for EC2 instance
# Run this once when setting up a new EC2 instance

set -e

echo "🔧 Initializing EC2 instance for blog deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI (if not already installed)
echo "☁️ Installing AWS CLI..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Create network for containers
echo "🌐 Creating Docker network..."
docker network create blog-network || true

# Setup PostgreSQL container
echo "🗄️ Setting up PostgreSQL..."
docker run -d \
  --name blog-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  --network blog-network \
  postgres:15-alpine || echo "PostgreSQL container already exists"

# Setup environment file template
echo "📝 Creating environment file template..."
cat > /home/ec2-user/.env.example << EOF
HUGGINGFACE_API_KEY=your_api_key_here
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your_account_id_here
EOF

# Setup automatic docker-compose startup (optional)
echo "⚙️ Setting up systemd service for automatic startup..."
sudo tee /etc/systemd/system/blog-app.service > /dev/null << EOF
[Unit]
Description=Blog Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ec2-user
ExecStart=/usr/local/bin/docker-compose -f /home/ec2-user/docker-compose.yml up -d
ExecStop=/usr/local/bin/docker-compose -f /home/ec2-user/docker-compose.yml down
User=ec2-user

[Install]
WantedBy=multi-user.target
EOF

echo "✅ EC2 initialization completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your AWS credentials: aws configure"
echo "2. Set up ECR repositories for frontend and backend"
echo "3. Configure environment variables"
echo "4. Run deployment script: ./deploy.sh"
echo ""
echo "⚠️ Note: You may need to log out and log back in for Docker group changes to take effect."



