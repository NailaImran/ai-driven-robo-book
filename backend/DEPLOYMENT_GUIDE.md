# Deployment Guide: FastAPI Backend to Railway

Complete guide for deploying the QuantumPages FastAPI backend to Railway with Neon PostgreSQL.

## Prerequisites

1. **Neon Account** - Free PostgreSQL hosting
   - Sign up at https://console.neon.tech
   - Create a project and database
   - Copy connection string

2. **Railway Account** - Cloud deployment
   - Sign up at https://railway.app
   - Create a new project

3. **Qdrant Account** (Optional) - Vector database
   - Sign up at https://cloud.qdrant.io
   - Create a cluster
   - Copy URL and API key

4. **OpenAI API Key** (Optional) - For embeddings
   - Get from https://platform.openai.com/api-keys

## Step 1: Setup Neon PostgreSQL

### 1.1 Create Database

1. Go to https://console.neon.tech
2. Create a new project (name: "quantumpages")
3. Wait for database to be created
4. Go to "Connection string" tab
5. Copy the **Connection String** for Node.js:
   ```
   postgresql://[user]:[password]@[host]/[dbname]
   ```
6. Convert to async format:
   ```
   postgresql+asyncpg://[user]:[password]@[host]/[dbname]
   ```

**Save this connection string - you'll need it for Railway.**

### 1.2 Test Connection (Optional)

```bash
# Install psql if not already installed
# On macOS: brew install postgresql
# On Windows: Download from https://www.postgresql.org/download/windows/

psql "postgresql://[user]:[password]@[host]/[dbname]"
# Should connect successfully
```

## Step 2: Setup Qdrant (Optional but Recommended)

### 2.1 Create Qdrant Cluster

1. Go to https://cloud.qdrant.io
2. Create new cluster (name: "quantumpages-vectors")
3. Choose "Free" tier
4. Wait for cluster to be created
5. Go to API keys section
6. Copy:
   - **URL**: https://xxx.qdrant.io:6333
   - **API Key**: Your API key

**Save these - you'll need them for Railway.**

### 2.2 Verify Collection Ready

Collections are created automatically when you run the backend.

## Step 3: Deploy to Railway

### 3.1 Connect GitHub Repository

```bash
# Make sure all changes are committed
cd C:\Users\lenovo\Desktop\Hackathone1\backend
git add .
git commit -m "feat: Add FastAPI backend with all phases"
git push origin main
```

### 3.2 Initialize Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project in backend directory
cd backend
railway init
# Choose "Create a new project"
# Name: "QuantumPages Backend"

# Link to GitHub repo
railway link
# Select your GitHub repository
```

### 3.3 Set Environment Variables

**Option A: Via Railway CLI**

```bash
# Set variables one by one
railway variables set DATABASE_URL="postgresql+asyncpg://user:pass@host/dbname"
railway variables set QDRANT_URL="https://xxx.qdrant.io:6333"
railway variables set QDRANT_API_KEY="your-api-key"
railway variables set OPENAI_API_KEY="sk-proj-xxx"
railway variables set JWT_SECRET_KEY="your_secret_key_min_32_characters_here"
railway variables set CORS_ORIGINS='["https://quantum-pages.vercel.app","http://localhost:3000"]'
railway variables set DEBUG="False"
```

**Option B: Via Railway Dashboard**

1. Go to https://railway.app/dashboard
2. Select your QuantumPages Backend project
3. Go to "Variables" tab
4. Add each variable from `.env.example`

### 3.4 Deploy

```bash
# Deploy to Railway
railway up

# Watch deployment
railway status

# View logs
railway logs
```

### 3.5 Verify Deployment

```bash
# Get deployment URL
railway status

# Test health endpoint
curl https://your-app.railway.app/health
# Should return: {"status":"healthy","version":"1.0.0","service":"QuantumPages Backend"}

# View API documentation
# Visit: https://your-app.railway.app/docs
```

## Step 4: Initialize Database

### 4.1 Run Seeding Script

```bash
# Seed lessons from markdown files
railway run python scripts/seed_lessons.py

# Output should show:
# ✅ Database initialized
# ✅ Created chapter-1-lesson-1: Introduction to Physical AI (120 min)
# ... (for all lessons)
# 📊 Seeding complete!
```

### 4.2 Generate Embeddings (Optional)

```bash
# Generate and upload embeddings to Qdrant
railway run python scripts/generate_embeddings.py

# Output should show:
# ✅ Embedded chapter-1-lesson-1: Introduction to Physical AI
# ... (for all lessons)
# 📊 Embedding Summary:
#    Success: 12
#    Failed: 0
```

## Step 5: Test API Endpoints

### 5.1 Signup

```bash
curl -X POST https://your-app.railway.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User",
    "background": {
      "python_experience": 3,
      "cpp_experience": 1,
      "ros_experience": 1,
      "robotics_experience": 2,
      "learning_goals": ["Learn ROS2", "Build robots"]
    }
  }'

# Response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIs...",
#   "token_type": "bearer",
#   "user": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "test@example.com",
#     "name": "Test User",
#     "expertise_level": "Intermediate"
#   }
# }
```

**Save the `access_token` for testing other endpoints.**

### 5.2 Get Lesson

```bash
TOKEN="your_access_token_from_signup"

curl https://your-app.railway.app/api/v1/lessons/chapter-1-lesson-1 \
  -H "Authorization: Bearer $TOKEN"
```

### 5.3 Get Progress Summary

```bash
curl https://your-app.railway.app/api/v1/progress/summary \
  -H "Authorization: Bearer $TOKEN"
```

### 5.4 Get Recommendations

```bash
curl https://your-app.railway.app/api/v1/recommendations/next-lesson \
  -H "Authorization: Bearer $TOKEN"
```

## Step 6: Monitor Deployment

### 6.1 View Logs

```bash
# Stream logs
railway logs --follow

# View recent logs
railway logs --lines 100

# View specific service logs
railway logs --service backend
```

### 6.2 Check Health

```bash
# Every 30 seconds, Railway checks health endpoint
railway status

# Manually test
curl https://your-app.railway.app/health
```

### 6.3 Database Connection

```bash
# Test database connection from Railway
railway run python -c "
import asyncio
from app.database import engine
async def test():
    async with engine.begin() as conn:
        result = await conn.execute('SELECT 1')
        print('Database connected:', result.scalar())
asyncio.run(test())
"
```

## Step 7: Configure Frontend Integration

### 7.1 Update Frontend Environment

Edit `quantum-pages/.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

### 7.2 CORS Configuration

The backend is already configured to accept requests from:
- `http://localhost:3000` (local development)
- `https://quantum-pages.vercel.app` (production)

If needed, update in Railway variables:
```bash
railway variables set CORS_ORIGINS='["https://your-vercel-url.vercel.app"]'
```

## Troubleshooting

### Database Connection Failed

**Error**: `could not connect to server: No such file or directory`

**Solutions**:
1. Verify DATABASE_URL is correct
2. Check Neon project is active
3. Ensure IP is not restricted (Neon allows all IPs by default)
4. Test connection locally first

```bash
# Test locally before deploying
psql postgresql+asyncpg://...
```

### "Collection not found" in Qdrant

**Solution**: Run seeding script:
```bash
railway run python scripts/seed_lessons.py
```

### Health check failing

**Error**: `Health check failed`

**Solutions**:
1. Check logs: `railway logs`
2. Verify DATABASE_URL is set
3. Ensure migrations ran successfully
4. Test health endpoint manually:
   ```bash
   curl https://your-app.railway.app/health
   ```

### Authentication failures

**Issue**: Getting 401 Unauthorized

**Solutions**:
1. Verify JWT_SECRET_KEY matches in Railway
2. Check token not expired (7 day expiry)
3. Ensure token in Authorization header format: `Bearer <token>`
4. Test signup first: `POST /api/v1/auth/signup`

### Embeddings not generating

**Error**: `OPENAI_API_KEY not configured`

**Solution**: Add OpenAI API key to Railway:
```bash
railway variables set OPENAI_API_KEY="sk-proj-xxx"
```

Or skip embeddings if not needed (recommendations will still work with keywords).

## Maintenance

### Update Lessons

When you update markdown files in physical-ai-textbook:

```bash
# Reseed lessons
railway run python scripts/seed_lessons.py

# Regenerate embeddings
railway run python scripts/generate_embeddings.py
```

### View Database

```bash
# Connect to production database
railway run psql $DATABASE_URL

# Example queries:
SELECT COUNT(*) FROM lessons;
SELECT * FROM users;
SELECT * FROM user_progress WHERE user_id = 'xxx';
```

### Scale Resources

1. Go to Railway dashboard
2. Select QuantumPages Backend project
3. Go to "Services" tab
4. Increase RAM/CPU as needed

### Backup Database

```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Or use Neon automated backups
# Go to Neon console > Backups
```

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| **Neon PostgreSQL** | Free (5GB) | $0 |
| **Qdrant** | Free (1GB) | $0 |
| **Railway** | Free (100 GB/month) | $0 |
| **OpenAI Embeddings** | Pay per use | ~$0.01 per 1000 tokens |

Total for MVP: **~$0/month** (free tiers sufficient)

## Next Steps

1. **Frontend Integration** (Phase 8)
   - Update quantum-pages API client
   - Connect LessonViewer to backend
   - Wrap with AuthProvider

2. **Testing**
   - Run full integration tests
   - Test all endpoints
   - Verify progress tracking

3. **Monitoring**
   - Setup error tracking (Sentry)
   - Configure alerts
   - Monitor performance

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Qdrant Docs**: https://qdrant.tech/documentation/

## Success Criteria

✅ Backend deployed to Railway
✅ Database seeded with all lessons
✅ Health check passing
✅ Signup/signin working
✅ Lessons retrievable with progress
✅ Quiz submission working
✅ Recommendations generating
✅ Embeddings uploaded to Qdrant (if enabled)

Once all criteria met, proceed to Phase 8: Frontend Integration.
