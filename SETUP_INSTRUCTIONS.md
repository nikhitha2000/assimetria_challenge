# Step-by-Step Setup Instructions

## Step 1: PostgreSQL Password Setup ✅

You've installed PostgreSQL and set a password. Good!

**Note down your password** - we'll need it for the backend configuration.

---

## Step 2: Verify PostgreSQL Installation

Open a terminal/PowerShell and check if PostgreSQL is running:

```bash
# Check if PostgreSQL service is running
# On Windows:
services.msc
# Look for "postgresql" service

# Or via command line:
sc query postgresql*
```

---

## Step 3: Install Node.js (if not already installed)

Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/ (LTS version)

---

## Step 4: Navigate to Project Directory

```bash
cd C:\assimetria
```

---

## Step 5: Configure Backend Environment

1. Create `.env` file in the `backend` folder:

```bash
cd backend
copy env.example.txt .env
```

2. Edit the `.env` file with your PostgreSQL settings:

Open `backend\.env` in a text editor and update:

```
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE  # Use the password you just set!

# HuggingFace API (Optional - can add later)
HUGGINGFACE_API_KEY=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## Step 6: Create Database

Connect to PostgreSQL and create the database:

```bash
# Connect to PostgreSQL (it will ask for your password)
psql -U postgres

# Once connected, create the database:
CREATE DATABASE blog_db;

# Exit PostgreSQL:
\q
```

---

## Step 7: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 8: Install Frontend Dependencies

```bash
cd ..\frontend
npm install
```

---

## Step 9: Option A - Run with Docker Compose (Recommended)

This is the easiest way - it handles everything automatically:

```bash
# Go back to project root
cd ..

# Make sure you update docker-compose.yml with your PostgreSQL password first
# Edit docker-compose.yml and update POSTGRES_PASSWORD

# Then run:
docker-compose up
```

---

## Step 9: Option B - Run Without Docker

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm start
```

### Terminal 3 - Start PostgreSQL (if using Docker for DB only):
```bash
docker run -d --name postgres -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=blog_db -p 5432:5432 postgres:15-alpine
```

---

## Step 10: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Articles API: http://localhost:5000/api/articles

---

## Troubleshooting

### Can't connect to PostgreSQL?
- Make sure PostgreSQL service is running
- Check if port 5432 is available
- Verify password in `.env` file

### Port already in use?
- Change PORT in backend `.env` (e.g., 5001)
- Update frontend `.env` to point to new port

### Database doesn't exist?
- Run the CREATE DATABASE command from Step 6
- Or the app will create it automatically on first run (depends on PostgreSQL permissions)



