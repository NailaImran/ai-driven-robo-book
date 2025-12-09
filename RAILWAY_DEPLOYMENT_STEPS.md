# 🚀 Railway Deployment - Step by Step

Complete instructions for deploying QuantumPages backend to Railway.

---

## STEP 1: Prerequisites (Have These Ready)

Before starting, gather these connection strings:

### Required
1. **Neon PostgreSQL URL** - from your Neon project
   - Format: `postgresql+asyncpg://user:password@host/dbname`
   - Get from: https://console.neon.tech → Project → Connection string → Node.js

2. **Railway Account** - Free tier is enough
   - Sign up at: https://railway.app
   - Already have? Great!

### Optional (for AI recommendations)
3. **Qdrant URL** - from Qdrant Cloud
   - Format: `https://xxx.qdrant.io:6333`
   - Get from: https://cloud.qdrant.io → Your cluster

4. **Qdrant API Key** - from Qdrant Cloud
   - Get from: https://cloud.qdrant.io → API Keys

5. **OpenAI API Key** - for embeddings
   - Get from: https://platform.openai.com → API Keys

**Save these in a text file - you'll need them!**

---

## STEP 2: Prepare & Commit Code

```bash
# Navigate to project root
cd C:\Users\lenovo\Desktop\Hackathone1

# Make sure all backend changes are staged
git status

# Add all backend files
git add backend/
git add quantum-pages/lib/api-client.ts
git add quantum-pages/.env.example
git add *.md

# Commit
git commit -m "feat: Add FastAPI backend with all 8 phases + frontend client

- Complete FastAPI application with 18 API endpoints
- Database models for users, lessons, quizzes, progress
- JWT authentication with password hashing
- Lesson management with markdown parsing
- Quiz system with automatic grading
- Progress tracking and analytics
- AI recommendations with Qdrant vector search
- Docker & Railway deployment ready
- Frontend API client for Next.js integration"

# Push to GitHub
git push origin main
```

**Status**: Code committed and pushed ✅

---

## STEP 3: Initialize Railway Project

### 3.1 Install Railway CLI

**On Windows (PowerShell as Admin):**
```powershell
npm install -g @railway/cli
```

**On macOS:**
```bash
npm install -g @railway/cli
# or
brew tap railwayapp/railway
brew install railway
```

**Verify installation:**
```bash
railway --version
```

### 3.2 Login to Railway

```bash
railway login
```

This opens your browser. Log in with your Railway account and authorize the CLI.

**Status**: Railway CLI logged in ✅

### 3.3 Initialize Railway Project

```bash
# Navigate to backend directory
cd C:\Users\lenovo\Desktop\Hackathone1\backend

# Initialize Railway
railway init
```

When prompted:
- **"Create a new project?"** → Select: `Create a new project`
- **"Enter project name"** → Type: `QuantumPages Backend`
- Wait for project to be created

**Status**: Railway project created ✅

---

## STEP 4: Link GitHub Repository

```bash
# In backend directory
railway link
```

When prompted:
- **Select your repository** → Choose the Hackathone1 repository
- Wait for linking to complete

This enables automatic deployments when you push to GitHub.

**Status**: GitHub linked to Railway ✅

---

## STEP 5: Set Environment Variables

**Very important:** Set these before deploying!

### 5.1 Database URL (Required)

```bash
railway variables set DATABASE_URL="postgresql+asyncpg://user:password@host/dbname"
```

Replace with YOUR actual Neon connection string!

### 5.2 JWT Secret (Required)

Generate a random secret (min 32 characters):
```bash
# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -InputObject (1..9999999) -Count 32) -join '')) | ForEach-Object {$_ -replace '==',''} | ForEach-Object {$_ -replace '=',''}

# On macOS/Linux:
openssl rand -base64 32

# Or just use this (change the numbers):
railway variables set JWT_SECRET_KEY="your_random_32_character_secret_key_12345678"
```

Copy the output and use it:
```bash
railway variables set JWT_SECRET_KEY="YOUR_RANDOM_SECRET_HERE"
```

### 5.3 Qdrant & OpenAI (Optional but Recommended)

If you have Qdrant:
```bash
railway variables set QDRANT_URL="https://xxx.qdrant.io:6333"
railway variables set QDRANT_API_KEY="your_qdrant_api_key"
```

If you have OpenAI:
```bash
railway variables set OPENAI_API_KEY="sk-proj-your_openai_key"
```

### 5.4 CORS Configuration (Required)

```bash
railway variables set CORS_ORIGINS='["https://quantum-pages.vercel.app","http://localhost:3000"]'
```

### 5.5 Debug Mode (Optional)

```bash
railway variables set DEBUG="False"
railway variables set LOG_LEVEL="INFO"
```

### Verify All Variables

```bash
railway variables list
```

You should see all variables set.

**Status**: All environment variables configured ✅

---

## STEP 6: Deploy to Railway

```bash
# In backend directory
cd C:\Users\lenovo\Desktop\Hackathone1\backend

# Deploy
railway up
```

This will:
1. Build the Docker image
2. Push to Railway
3. Start the service
4. Create the database connection

**Expected output:**
```
Building...
Deploying...
✓ Deployment successful
Service URL: https://your-app-xxxxx.railway.app
```

**Status**: Backend deployed! ✅

### Watch the Deployment

```bash
# View live logs
railway logs --follow

# Or view status
railway status
```

Wait until you see:
```
✓ Service is healthy
✓ Health check passed
```

This takes 2-5 minutes.

---

## STEP 7: Verify Deployment

### 7.1 Get Your Railway URL

```bash
railway domains
# or
railway status

# You'll see something like:
# Service URL: https://quantumpages-backend-prod.railway.app
```

**Save this URL - you'll need it for the frontend!**

### 7.2 Test Health Endpoint

```bash
# Replace YOUR_URL with your actual Railway URL
curl https://YOUR_URL/health

# Expected response:
# {"status":"healthy","version":"1.0.0","service":"QuantumPages Backend"}
```

### 7.3 Open API Documentation

Go to your browser:
```
https://YOUR_URL/docs
```

You should see the Swagger UI with all 18 endpoints documented!

**Status**: Deployment verified ✅

---

## STEP 8: Initialize Database

Now seed the lessons into your database!

### 8.1 Seed Lessons

```bash
railway run python scripts/seed_lessons.py
```

**Expected output:**
```
🌱 Starting lesson seeding...
✅ Database initialized
✅ Created chapter-1-lesson-1: Introduction to Physical AI (120 min)
✅ Created chapter-1-lesson-2: Embodied Intelligence (100 min)
✅ Created chapter-1-lesson-3: Hardware Landscape (90 min)
...
📊 Seeding complete!
   Created: 12
   Skipped: 0
```

**Status**: Lessons seeded ✅

### 8.2 Generate Embeddings (Optional)

If you set up Qdrant and OpenAI:

```bash
railway run python scripts/generate_embeddings.py
```

**Expected output:**
```
🚀 Starting embedding generation...
✅ Embedded chapter-1-lesson-1: Introduction to Physical AI
✅ Embedded chapter-1-lesson-2: Embodied Intelligence
...
📊 Embedding Summary:
   Success: 12
   Failed: 0
```

**Status**: Embeddings ready ✅

---

## STEP 9: Test API Endpoints

### 9.1 Test Signup

```bash
curl -X POST https://YOUR_URL/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "name": "Test User",
    "background": {
      "python_experience": 2,
      "cpp_experience": 1,
      "ros_experience": 1,
      "robotics_experience": 2,
      "software_projects_count": 3,
      "hardware_projects_count": 1,
      "hardware_platforms": ["Arduino", "Raspberry Pi"],
      "current_role": "Student",
      "preferred_language": "Python",
      "learning_pace": "Moderate",
      "learning_goals": ["Learn ROS2", "Build robots"]
    }
  }'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "name": "Test User",
    "expertise_level": "Intermediate"
  }
}
```

**Save the `access_token` - you'll need it for other tests!**

### 9.2 Test Get Lessons

```bash
# Replace TOKEN with your access_token from signup
TOKEN="your_access_token_here"

curl https://YOUR_URL/api/v1/lessons \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "total": 12,
  "lessons": [
    {
      "id": "chapter-1-lesson-1",
      "title": "Introduction to Physical AI",
      ...
    }
  ]
}
```

### 9.3 Test Get Progress

```bash
curl https://YOUR_URL/api/v1/progress/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "total_lessons": 12,
  "completed_lessons": 0,
  "completion_percentage": 0.0,
  "total_time_hours": 0.0,
  "quiz_average": 0.0,
  "chapters": [...]
}
```

**Status**: API endpoints working! ✅

---

## STEP 10: Save Your Credentials

Create `.env.local` with your deployment info:

```bash
# Backend URL
RAILWAY_URL=https://YOUR_URL
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
JWT_SECRET_KEY=your_jwt_secret

# For later: Frontend will use RAILWAY_URL
```

Save this file securely - you'll need it for the frontend!

---

## Deployment Summary

✅ **Backend is now live at**: `https://YOUR_URL`

### What's Running
- FastAPI application with 18 API endpoints
- PostgreSQL database with 12 lessons
- JWT authentication
- Quiz system
- Progress tracking
- AI recommendations (if Qdrant + OpenAI enabled)

### Next Steps
1. Note your Railway URL
2. Proceed to Frontend Integration (Phase 8)
3. Update quantum-pages with API URL
4. Deploy frontend to Vercel

---

## Troubleshooting

### Build Failed
```bash
# Check logs
railway logs --tail 100

# Common issues:
# - Missing environment variables → Set them with `railway variables set`
# - Database connection error → Verify DATABASE_URL
# - Dependencies not found → Check requirements.txt
```

### Health Check Failing
```bash
# View logs
railway logs

# Test locally first:
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Then test: http://localhost:8000/health
```

### Database Connection Error
```bash
# Verify connection string
railway variables list | grep DATABASE_URL

# Test connection
railway run psql $DATABASE_URL -c "SELECT 1"
```

### Can't find Railway URL
```bash
# List all info
railway status

# Look for: Service URL: https://...
```

---

## Useful Commands

```bash
# View logs
railway logs

# Watch logs in real-time
railway logs --follow

# View environment variables
railway variables list

# Set a variable
railway variables set NAME="value"

# View current service
railway status

# List available commands
railway --help

# View database
railway run psql $DATABASE_URL
```

---

## Success Metrics

✅ Health endpoint returns healthy
✅ API docs accessible at `/docs`
✅ Signup creates user successfully
✅ Lessons retrievable with token
✅ 12 lessons in database
✅ No errors in logs

**Once all ✅, proceed to Frontend Integration!**

---

## Important Notes

- **Never commit .env files** to Git
- **Save your Railway URL** - you'll need it for frontend
- **Keep JWT_SECRET_KEY private** - don't share it
- **Monitor Railway dashboard** for logs and metrics
- **Free tier is sufficient** for MVP (~100GB/month)

---

**Ready to deploy? Start with STEP 1 and follow each step sequentially!**

For help: Check Railway logs with `railway logs`
