# ⚡ Quick Deployment Checklist

**Get your FastAPI backend live in 30 minutes!**

---

## Prerequisites (5 minutes)

### Create Accounts (if needed)
- [ ] Railway: https://railway.app
- [ ] Neon: https://console.neon.tech
- [ ] OpenAI: https://platform.openai.com (optional, for embeddings)
- [ ] Qdrant: https://cloud.qdrant.io (optional, for recommendations)

### Get Connection Strings
- [ ] **Neon DATABASE_URL**: `postgresql+asyncpg://user:pass@host/dbname`
- [ ] **Qdrant URL**: `https://xxx.qdrant.io:6333`
- [ ] **Qdrant API Key**: `xxxxxxxxxx`
- [ ] **OpenAI API Key**: `sk-proj-xxxxx`
- [ ] **JWT Secret**: (generate random 32+ char string)

---

## Step 1: Prepare Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Commit changes
git add .
git commit -m "feat: Add FastAPI backend (all 8 phases complete)"
git push origin main
```

- [ ] Changes committed to git
- [ ] Pushed to GitHub

---

## Step 2: Deploy to Railway (10 minutes)

### Initialize Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize in backend directory
cd backend
railway init
# Select: Create a new project
# Name: "QuantumPages Backend"

# Link GitHub
railway link
# Select your repository
```

- [ ] Railway project created
- [ ] GitHub repository linked

### Set Environment Variables
```bash
# Set all variables
railway variables set DATABASE_URL="postgresql+asyncpg://..."
railway variables set QDRANT_URL="https://..."
railway variables set QDRANT_API_KEY="..."
railway variables set OPENAI_API_KEY="sk-..."
railway variables set JWT_SECRET_KEY="your_min_32_char_secret"
railway variables set CORS_ORIGINS='["https://quantum-pages.vercel.app","http://localhost:3000"]'
```

- [ ] All environment variables set
- [ ] Secrets stored securely

### Deploy
```bash
# Deploy to Railway
railway up

# Watch deployment
railway status

# Check logs
railway logs
```

- [ ] Deployment started
- [ ] No build errors
- [ ] Service is healthy

---

## Step 3: Initialize Database (5 minutes)

```bash
# Seed lessons from markdown
railway run python scripts/seed_lessons.py

# Expected output:
# ✅ Database initialized
# ✅ Created chapter-1-lesson-1: ...
# 📊 Seeding complete!
#    Created: 12
```

- [ ] Lessons seeded successfully
- [ ] 12 lessons in database

### Optional: Generate Embeddings

```bash
# If using Qdrant recommendations
railway run python scripts/generate_embeddings.py

# Expected output:
# ✅ Embedded chapter-1-lesson-1: ...
# 📊 Embedding Summary:
#    Success: 12
#    Failed: 0
```

- [ ] Embeddings generated (if using Qdrant)

---

## Step 4: Verify Deployment (5 minutes)

### Get Deployment URL
```bash
railway status
# Look for: Service URL: https://your-app.railway.app
```

### Test Health Endpoint
```bash
curl https://your-app.railway.app/health

# Expected response:
# {"status":"healthy","version":"1.0.0","service":"QuantumPages Backend"}
```

- [ ] Health check passing
- [ ] Status is "healthy"

### Test Signup
```bash
curl -X POST https://your-app.railway.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User",
    "background": {
      "python_experience": 2,
      "learning_goals": ["Learn ROS2"]
    }
  }'

# Expected: access_token returned
```

- [ ] Signup works
- [ ] Token generated
- [ ] User created in database

### Test API Docs
```bash
# Open in browser:
https://your-app.railway.app/docs

# Should see Swagger UI with all endpoints
```

- [ ] Swagger UI accessible
- [ ] All 18 endpoints listed

---

## Step 5: Configure Frontend (2 minutes)

### Update Environment
```bash
# In quantum-pages/.env.local
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

- [ ] API URL configured
- [ ] Frontend .env.local updated

### Test API Client
```bash
# In quantum-pages, you can now use:
import { apiClient } from '@/lib/api-client'

// Test connection
const session = await apiClient.getSession()
```

- [ ] API client works
- [ ] CORS configured
- [ ] Frontend can call backend

---

## Success Checklist ✅

| Item | Status |
|------|--------|
| Railway deployment complete | [ ] |
| Database seeded | [ ] |
| Health check passing | [ ] |
| Signup/signin working | [ ] |
| API docs accessible | [ ] |
| Lessons retrievable | [ ] |
| Frontend API client ready | [ ] |
| CORS configured | [ ] |
| Environment variables set | [ ] |
| No errors in logs | [ ] |

---

## Troubleshooting

### "Connection refused"
- [ ] Check DATABASE_URL is correct
- [ ] Verify Neon database is active
- [ ] Wait 30 seconds for Railway to initialize

### "Unauthorized" on signup
- [ ] Check JWT_SECRET_KEY is set
- [ ] Ensure SECRET_KEY is min 32 chars

### "Health check failed"
- [ ] Run: `railway logs`
- [ ] Check for database connection errors
- [ ] Verify DATABASE_URL format

### Embeddings won't generate
- [ ] Add OPENAI_API_KEY to Railway
- [ ] Check OpenAI API is enabled
- [ ] Skip if not using recommendations

---

## What's Next

1. **Frontend Integration** (Phase 8)
   - Create AuthContext
   - Update LessonViewer
   - Wrap app with AuthProvider
   - Deploy to Vercel

2. **Testing**
   - Test all endpoints
   - Verify progress tracking
   - Check recommendations work

3. **Monitoring**
   - Watch Railway logs
   - Monitor database usage
   - Check API response times

---

## Useful Commands

```bash
# View logs
railway logs --follow

# Check status
railway status

# View database
railway run psql $DATABASE_URL

# Run migrations
railway run alembic upgrade head

# Restart service
railway restart

# View variables
railway variables list
```

---

## Support Links

- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **API Docs (after deploy)**: https://your-app.railway.app/docs

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Prerequisites | 5 min | ⏳ |
| Prepare Backend | 5 min | ⏳ |
| Deploy to Railway | 10 min | ⏳ |
| Initialize Database | 5 min | ⏳ |
| Verify | 5 min | ⏳ |
| Frontend Config | 2 min | ⏳ |
| **TOTAL** | **30 min** | ⏳ |

---

## Post-Deployment

✅ **Backend is live!** Your API is available at: `https://your-app.railway.app`

### Next: Frontend Integration
See `IMPLEMENTATION_COMPLETE.md` for Phase 8 integration steps.

### Monitoring
- Check logs daily: `railway logs`
- Monitor costs (all free tier)
- Setup alerts in Railway dashboard

### Scaling
When you need more capacity:
1. Go to Railway dashboard
2. Select QuantumPages Backend
3. Increase RAM/CPU in settings
4. Service auto-restarts

---

**You're done! 🎉 Backend is deployed and ready for frontend integration.**
