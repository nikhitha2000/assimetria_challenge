# AWS Deployment Guide

This guide walks you through deploying the auto-generated blog application to AWS using EC2, ECR, and CodeBuild.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed locally (for testing)
- GitHub repository created

## Step 1: Set Up AWS Resources

### 1.1 Create ECR Repositories

Run the setup script to create ECR repositories:

```bash
cd infra/scripts
chmod +x setup-ecr.sh
./setup-ecr.sh
```

Or manually:

```bash
aws ecr create-repository --repository-name blog-backend --region us-east-1
aws ecr create-repository --repository-name blog-frontend --region us-east-1
```

### 1.2 Get Your AWS Account ID

```bash
aws sts get-caller-identity --query Account --output text
```

Update `infra/buildspec.yml` with your AWS Account ID:
```yaml
AWS_ACCOUNT_ID: "YOUR_ACCOUNT_ID"  # Replace this
```

### 1.3 Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose an Amazon Linux 2 AMI (free tier eligible)
3. Select instance type: `t2.micro` or `t3.micro` (free tier)
4. Configure security group:
   - Allow HTTP (port 80) from anywhere (0.0.0.0/0)
   - Allow HTTPS (port 443) from anywhere
   - Allow SSH (port 22) from your IP
   - Allow custom TCP (port 5000) from anywhere (for backend API if needed)
5. Launch and save your key pair

### 1.4 Connect to EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

## Step 2: Initialize EC2 Instance

On your EC2 instance, run the initialization script:

```bash
# Copy init-ec2.sh to EC2 or clone the repository
git clone <your-repo-url>
cd assimetria/infra/scripts
chmod +x init-ec2.sh
./init-ec2.sh
```

Or manually install:

```bash
# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

**Important:** Log out and log back in after adding user to docker group.

## Step 3: Set Up CodeBuild

### 3.1 Create CodeBuild Project

1. Go to AWS Console → CodeBuild → Create build project

2. **Project Configuration:**
   - Project name: `blog-build`
   - Description: "Build blog Docker images"

3. **Source:**
   - Source provider: GitHub
   - Connect to GitHub (authorize AWS)
   - Repository: Select your repository
   - Branch: `main` or `master`

4. **Environment:**
   - Environment image: Managed image
   - Operating system: Amazon Linux 2
   - Runtime: Standard
   - Image: aws/codebuild/amazonlinux2-x86_64-standard:5.0
   - Privileged: ✅ Enable (required for Docker)

5. **Service Role:**
   - Create new service role or use existing
   - Ensure it has permissions for:
     - ECR (push/pull images)
     - CloudWatch Logs

6. **Buildspec:**
   - Buildspec name: `infra/buildspec.yml`

7. **Artifacts:**
   - Type: No artifacts (or S3 if you want)

### 3.2 Configure CodeBuild Service Role

The service role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### 3.3 Configure Environment Variables (Optional)

If storing HuggingFace API key in Secrets Manager:

1. Create secret in AWS Secrets Manager:
   ```bash
   aws secretsmanager create-secret \
     --name blog/huggingface-api-key \
     --secret-string "your-api-key-here"
   ```

2. Update CodeBuild project to access the secret

Or simply set as environment variable in CodeBuild project:
- Name: `HUGGINGFACE_API_KEY`
- Value: `your-api-key-here`

Also set:
- `REACT_APP_API_URL`: Your EC2 public IP or domain (e.g., `http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com`)

## Step 4: Set Up Database on EC2

On your EC2 instance:

```bash
# Create Docker network
docker network create blog-network

# Run PostgreSQL container
docker run -d \
  --name blog-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  --network blog-network \
  postgres:15-alpine
```

## Step 5: Deploy Application

### 5.1 Trigger CodeBuild

After pushing code to GitHub, CodeBuild should automatically trigger if webhook is configured. Or manually:

1. Go to CodeBuild console
2. Select your project
3. Click "Start build"

### 5.2 Deploy to EC2

On your EC2 instance:

```bash
cd /path/to/assimetria/infra/scripts

# Set environment variables
export HUGGINGFACE_API_KEY="your-api-key"
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="your-account-id"

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or manually:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Pull latest images
docker pull <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker pull <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest

# Stop old containers
docker stop blog-backend blog-frontend
docker rm blog-backend blog-frontend

# Run new containers
docker run -d \
  --name blog-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e DB_HOST=blog-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=blog_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e HUGGINGFACE_API_KEY="your-key" \
  -e FRONTEND_URL="http://your-ec2-ip" \
  --network blog-network \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest

docker run -d \
  --name blog-frontend \
  --restart unless-stopped \
  -p 80:80 \
  --network blog-network \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest
```

## Step 6: Verify Deployment

1. **Check containers:**
   ```bash
   docker ps
   ```

2. **Check logs:**
   ```bash
   docker logs blog-backend
   docker logs blog-frontend
   ```

3. **Test endpoints:**
   - Frontend: `http://your-ec2-public-ip`
   - Backend API: `http://your-ec2-public-ip:5000/api/articles`
   - Health check: `http://your-ec2-public-ip:5000/health`

## Step 7: Configure Automatic Deployments (Optional)

### Option A: Manual Deployment

After each CodeBuild completion, SSH into EC2 and run `deploy.sh`

### Option B: Automated Deployment

Create a script that CodeBuild can trigger:

1. Create AWS Systems Manager (SSM) document to run commands on EC2
2. Configure CodeBuild to call SSM after successful build
3. Or use AWS CodeDeploy (more complex, not required for this challenge)

## Troubleshooting

### Containers not starting
- Check logs: `docker logs <container-name>`
- Verify environment variables
- Check network connectivity: `docker network inspect blog-network`

### Can't connect to database
- Verify PostgreSQL container is running: `docker ps`
- Check database credentials
- Test connection: `docker exec -it blog-postgres psql -U postgres -d blog_db`

### Images not pulling from ECR
- Verify AWS credentials on EC2: `aws sts get-caller-identity`
- Check ECR repository permissions
- Verify login: `aws ecr get-login-password --region us-east-1`

### CodeBuild failing
- Check build logs in CloudWatch
- Verify buildspec.yml syntax
- Ensure ECR repositories exist
- Check service role permissions

## Maintenance

### Update Application

1. Push code changes to GitHub
2. CodeBuild automatically builds new images
3. Run deployment script on EC2

### View Logs

```bash
# Application logs
docker logs -f blog-backend
docker logs -f blog-frontend

# Database logs
docker logs -f blog-postgres
```

### Backup Database

```bash
docker exec blog-postgres pg_dump -U postgres blog_db > backup.sql
```

### Restore Database

```bash
docker exec -i blog-postgres psql -U postgres blog_db < backup.sql
```

## Cost Estimation

- **EC2 t2.micro**: Free tier (750 hours/month) or ~$8-10/month
- **ECR Storage**: ~$0.10 per GB/month (minimal for small images)
- **CodeBuild**: ~$0.005 per build minute (free tier: 100 minutes/month)
- **Data Transfer**: First 100 GB free, then $0.09/GB
- **HuggingFace API**: Free (no cost)

**Estimated Monthly Cost**: $0-15 (mostly within free tier)


