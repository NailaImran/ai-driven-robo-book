# Quick Deploy Guide

**5-Minute Setup for GitHub Pages Deployment**

## Prerequisites ✓

- [x] Code pushed to GitHub repository
- [x] Build passes locally (`npm run build` succeeds)
- [x] No broken links (verified ✓)

## Steps to Deploy

### 1. Enable GitHub Pages (One-Time Setup)

1. Go to your repository: https://github.com/NailaImran/learn-humanoid-robotics
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions** ⚙️
4. Click **Save**

### 2. Push to Main Branch

```bash
git add .
git commit -m "Deploy: Ready for GitHub Pages"
git push origin main
```

### 3. Monitor Deployment

1. Go to **Actions** tab: https://github.com/NailaImran/learn-humanoid-robotics/actions
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait 3-5 minutes for completion

### 4. Access Your Site

🌐 **Your Live Site:**
```
https://nailaimran.github.io/learn-humanoid-robotics/
```

---

## What Happens During Deployment?

The GitHub Actions workflow automatically:

1. ✅ **Checks out code** from your repository
2. ✅ **Installs dependencies** (`npm ci`)
3. ✅ **Runs linting** (ESLint checks)
4. ✅ **Runs type checking** (TypeScript validation)
5. ✅ **Builds the site** (`npm run build`)
6. ✅ **Validates links** (ensures no broken links)
7. ✅ **Uploads artifacts** to GitHub Pages
8. ✅ **Deploys to production** (live site)

**Total Time:** ~3-5 minutes

---

## Verify Deployment

### Quick Checks

```bash
# 1. Check deployment status
# Go to: https://github.com/NailaImran/learn-humanoid-robotics/actions

# 2. Test your live site
# Visit: https://nailaimran.github.io/learn-humanoid-robotics/

# 3. Run Lighthouse audit (optional)
npx lighthouse https://nailaimran.github.io/learn-humanoid-robotics/ --view
```

### Expected Results

- ✅ Site loads without errors
- ✅ All pages accessible via navigation
- ✅ Images and diagrams render correctly
- ✅ Search functionality works
- ✅ Mobile responsive
- ✅ Lighthouse scores:
  - Performance: >90
  - Accessibility: >95

---

## Common Issues & Quick Fixes

### ❌ 404 Error on Site

**Cause:** Wrong `baseUrl` in config

**Fix:**
1. Check `website/docusaurus.config.js`:
   ```javascript
   baseUrl: '/learn-humanoid-robotics/',  // Must match repo name
   ```
2. Rebuild and redeploy

### ❌ Build Fails in GitHub Actions

**Cause:** Dependency or lint errors

**Fix:**
```bash
# Test locally first
cd website
npm run lint
npm run typecheck
npm run build

# Fix any errors, then push again
```

### ❌ Styles/Images Not Loading

**Cause:** Incorrect base URL

**Fix:** Verify in `docusaurus.config.js`:
```javascript
url: 'https://nailaimran.github.io',
baseUrl: '/learn-humanoid-robotics/',
organizationName: 'NailaImran',
projectName: 'learn-humanoid-robotics',
```

---

## Manual Deployment (Alternative)

If automatic deployment doesn't work:

```bash
cd website

# Build locally
npm run build

# Deploy using Docusaurus CLI
GIT_USER=NailaImran npm run deploy
```

---

## Update Content After Deployment

1. Edit MDX files in `website/docs/`
2. Test locally:
   ```bash
   npm start  # Development mode
   npm run build  # Production test
   ```
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update: <description>"
   git push origin main
   ```
4. Deployment happens automatically!

---

## Next Steps After Deployment

- [ ] Add deployment status badge to README
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (Google Analytics, optional)
- [ ] Deploy backend to Railway (see DEPLOYMENT.md)
- [ ] Set up monitoring (optional)

---

## Support

**Full Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md)

**Issues:** https://github.com/NailaImran/learn-humanoid-robotics/issues

---

**Ready to Deploy?** Just push to `main` and GitHub Actions handles the rest! 🚀
