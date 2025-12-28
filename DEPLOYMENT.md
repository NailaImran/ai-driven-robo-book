# Deployment Guide

Complete guide for deploying the Physical AI & Humanoid Robotics Interactive Textbook.

## Table of Contents

1. [Frontend Deployment (GitHub Pages)](#frontend-deployment-github-pages)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Troubleshooting](#troubleshooting)
4. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Frontend Deployment (GitHub Pages)

### Prerequisites

- GitHub repository with code pushed to `main` branch
- GitHub Actions enabled in repository settings
- Node.js 18+ installed locally for testing

### Setup Steps

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
5. Click **Save**

#### 2. Verify Workflow Configuration

The deployment workflow is located at `.github/workflows/deploy.yml`. It includes:

- ✅ **Automatic Triggers**: Runs on push to `main` or `master` branches
- ✅ **Manual Trigger**: Can be triggered from GitHub Actions UI
- ✅ **Quality Gates**: Linting, type checking, link validation
- ✅ **Production Build**: Optimized for performance
- ✅ **Artifact Upload**: Builds uploaded to GitHub Pages

#### 3. Test Locally Before Deploying

```bash
# Navigate to website directory
cd website

# Install dependencies
npm install

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build production bundle
npm run build

# Serve production build locally
npm run serve
```

Visit `http://localhost:3000` to test the production build.

#### 4. Deploy to GitHub Pages

**Option A: Automatic Deployment**

Simply push to the `main` branch:

```bash
git add .
git commit -m "feat: update content for deployment"
git push origin main
```

**Option B: Manual Deployment**

1. Go to **Actions** tab in GitHub repository
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

#### 5. Monitor Deployment

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Monitor build progress:
   - ✅ Install dependencies
   - ✅ Run linting (ESLint)
   - ✅ Run type checking (TypeScript)
   - ✅ Build website
   - ✅ Validate links
   - ✅ Upload artifact
   - ✅ Deploy to GitHub Pages

Expected completion time: **3-5 minutes**

#### 6. Access Your Deployed Site

**Default URL Format:**
```
https://<username>.github.io/<repository-name>/
```

**For This Project:**
```
https://nailaimran.github.io/learn-humanoid-robotics/
```

### Custom Domain (Optional)

To use a custom domain like `textbook.example.com`:

1. Add a `CNAME` file to `website/static/CNAME`:
   ```
   textbook.example.com
   ```

2. In your domain registrar's DNS settings, add:
   ```
   Type: CNAME
   Name: textbook
   Value: <username>.github.io
   ```

3. In GitHub Pages settings:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

---

## Backend Deployment (Railway)

### Prerequisites

- Railway account (https://railway.app)
- Railway CLI installed
- Environment variables ready (API keys, database URLs)

### Setup Steps

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Login to Railway

```bash
railway login
```

#### 3. Create New Project

**Option A: Railway Dashboard**
1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Authorize Railway to access your repository
5. Select `learn-humanoid-robotics` repository

**Option B: Railway CLI**
```bash
cd backend
railway init
```

#### 4. Configure Environment Variables

In Railway dashboard (Project → Variables):

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NEON_DATABASE_URL=postgresql://user:pass@host/dbname
QDRANT_URL=https://xxxxx.qdrant.cloud
QDRANT_API_KEY=xxxxxxxxxxxxx
BETTER_AUTH_SECRET=xxxxxxxxxxxxx  # Generate with: openssl rand -hex 32
JWT_SECRET_KEY=xxxxxxxxxxxxx      # Generate with: openssl rand -hex 32
PYTHON_VERSION=3.11
PORT=8000
```

#### 5. Set Build Configuration

Railway should auto-detect FastAPI. If needed, set:

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 6. Deploy

**Option A: Automatic Deployment**
Railway auto-deploys on git push to `main`:

```bash
git push origin main
```

**Option B: Manual Deployment**
```bash
railway up
```

#### 7. Run Database Migrations

After first deployment:

```bash
railway run alembic upgrade head
```

#### 8. Access Backend API

Railway provides a URL like:
```
https://learn-humanoid-robotics-production.up.railway.app
```

API documentation available at:
```
https://<your-railway-url>/docs
```

---

## Troubleshooting

### Frontend Issues

#### Build Fails with "Module not found"

**Solution:**
```bash
cd website
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Broken Links Warning

**Solution:**
1. Run build locally to see specific broken links:
   ```bash
   npm run build 2>&1 | grep "Broken link"
   ```

2. Fix links in MDX files:
   - Remove `.mdx` extensions from internal links
   - Use absolute paths like `/docs/introduction/` instead of `./`
   - Ensure document IDs match actual file structure

#### 404 on GitHub Pages After Deployment

**Causes:**
- Incorrect `baseUrl` in `docusaurus.config.js`
- GitHub Pages source not set to "GitHub Actions"

**Solution:**
1. Check `website/docusaurus.config.js`:
   ```javascript
   baseUrl: '/learn-humanoid-robotics/',  // Must match repo name
   ```

2. Verify GitHub Pages settings:
   - Settings → Pages → Source: **GitHub Actions**

#### Styles/Images Not Loading

**Cause:** Incorrect `baseUrl` configuration

**Solution:**
Update `docusaurus.config.js`:
```javascript
url: 'https://nailaimran.github.io',
baseUrl: '/learn-humanoid-robotics/',
```

### Backend Issues

#### Database Connection Fails

**Solution:**
1. Verify `NEON_DATABASE_URL` format:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

2. Test connection locally:
   ```bash
   cd backend
   python -c "from app.core.database import engine; print('✓ Connected')"
   ```

#### OpenAI API Rate Limit

**Solution:**
1. Check API key tier (free tier has strict limits)
2. Implement rate limiting in backend
3. Use caching for frequently asked questions

#### Railway Build Fails

**Common Causes:**
- Missing `requirements.txt`
- Incompatible Python version
- Missing environment variables

**Solution:**
1. Verify `requirements.txt` exists in `backend/`
2. Set `PYTHON_VERSION=3.11` in Railway environment
3. Check Railway build logs for specific errors

---

## Post-Deployment Checklist

### Frontend Verification

- [ ] Site loads at GitHub Pages URL
- [ ] All pages accessible via navigation
- [ ] Search functionality works
- [ ] Images and diagrams render correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser DevTools
- [ ] Lighthouse scores:
  - Performance: >90
  - Accessibility: >95
  - Best Practices: >90
  - SEO: >90

**Run Lighthouse Audit:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://nailaimran.github.io/learn-humanoid-robotics/ --view
```

### Backend Verification

- [ ] API documentation accessible at `/docs`
- [ ] Health check endpoint returns 200
- [ ] Database migrations applied successfully
- [ ] Vector database (Qdrant) connected
- [ ] OpenAI API calls working
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly
- [ ] No sensitive data in logs

**Test Backend Health:**
```bash
curl https://<your-railway-url>/health
# Expected: {"status": "healthy"}
```

### Integration Testing

- [ ] Frontend can connect to backend API
- [ ] Chatbot sends queries and receives responses
- [ ] User authentication flow works
- [ ] Personalization settings persist
- [ ] Link between frontend and backend CORS configured

### Monitoring Setup

1. **GitHub Actions**: Monitor deployment status
   - GitHub repo → Actions tab

2. **Railway Metrics**: Monitor backend performance
   - Railway dashboard → Metrics tab

3. **Error Tracking** (Optional):
   - Sentry for backend errors
   - Google Analytics for frontend analytics

---

## Rollback Procedure

### Frontend Rollback

**Option 1: Revert Git Commit**
```bash
git revert HEAD
git push origin main
```

**Option 2: Re-deploy Previous Commit**
1. Go to Actions tab
2. Find previous successful deployment
3. Click "Re-run jobs"

### Backend Rollback

**Option 1: Railway Dashboard**
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Redeploy"

**Option 2: Railway CLI**
```bash
railway rollback
```

---

## Continuous Integration

The project uses GitHub Actions for CI/CD:

- **Linting**: ESLint checks code quality
- **Type Checking**: TypeScript ensures type safety
- **Link Validation**: Docusaurus validates all internal links
- **Build**: Production-optimized build
- **Deploy**: Automatic deployment to GitHub Pages

**Workflow Status Badge:**

Add to README.md:
```markdown
![Deploy](https://github.com/NailaImran/learn-humanoid-robotics/actions/workflows/deploy.yml/badge.svg)
```

---

## Support

- **Issues**: https://github.com/NailaImran/learn-humanoid-robotics/issues
- **Discussions**: https://github.com/NailaImran/learn-humanoid-robotics/discussions
- **Documentation**: See README.md and specs/ directory

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
