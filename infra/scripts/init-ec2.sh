#!/bin/bash
# --- init-ec2.sh ---

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting EC2 instance provisioning..."

# --- 1. Install Docker (Amazon Linux 2/CentOS compatible) ---
echo "Installing Docker..."
sudo yum update -y
sudo yum install docker -y

# --- 2. Start and Enable Docker Service ---
sudo systemctl start docker
sudo systemctl enable docker

# --- 3. Add current user (e.g., ec2-user) to the docker group ---
# This allows running docker commands without 'sudo'
USER=$(whoami)
echo "Adding user $USER to the docker group..."
sudo usermod -aG docker $USER

# --- 4. Install Docker Compose v2 ---
echo "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="v2.24.5"
sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

echo "Provisioning complete. Please log out and log back in for docker group changes to take effect."