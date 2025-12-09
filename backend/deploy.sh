#!/bin/bash

# QuantumPages Backend Deployment Script for Railway
# This script automates the Railway deployment process

set -e  # Exit on error

echo "🚀 QuantumPages Backend Deployment Script"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found!${NC}"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}Step 1: Logging into Railway...${NC}"
railway login
echo -e "${GREEN}✅ Logged in${NC}"
echo ""

# Step 2: Initialize project
echo -e "${YELLOW}Step 2: Initializing Railway project...${NC}"
railway init
echo -e "${GREEN}✅ Project initialized${NC}"
echo ""

# Step 3: Link GitHub
echo -e "${YELLOW}Step 3: Linking GitHub repository...${NC}"
railway link
echo -e "${GREEN}✅ GitHub linked${NC}"
echo ""

# Step 4: Set environment variables
echo -e "${YELLOW}Step 4: Setting environment variables...${NC}"

read -p "Enter Neon DATABASE_URL: " DATABASE_URL
railway variables set DATABASE_URL="$DATABASE_URL"
echo -e "${GREEN}✅ Database URL set${NC}"

read -p "Enter JWT_SECRET_KEY (min 32 chars): " JWT_SECRET_KEY
railway variables set JWT_SECRET_KEY="$JWT_SECRET_KEY"
echo -e "${GREEN}✅ JWT secret set${NC}"

read -p "Enter Qdrant URL (press Enter to skip): " QDRANT_URL
if [ ! -z "$QDRANT_URL" ]; then
    railway variables set QDRANT_URL="$QDRANT_URL"
    read -p "Enter Qdrant API Key: " QDRANT_API_KEY
    railway variables set QDRANT_API_KEY="$QDRANT_API_KEY"
    echo -e "${GREEN}✅ Qdrant configured${NC}"
fi

read -p "Enter OpenAI API Key (press Enter to skip): " OPENAI_API_KEY
if [ ! -z "$OPENAI_API_KEY" ]; then
    railway variables set OPENAI_API_KEY="$OPENAI_API_KEY"
    echo -e "${GREEN}✅ OpenAI API key set${NC}"
fi

railway variables set CORS_ORIGINS='["https://quantum-pages.vercel.app","http://localhost:3000"]'
echo -e "${GREEN}✅ CORS configured${NC}"

echo ""

# Step 5: Deploy
echo -e "${YELLOW}Step 5: Deploying to Railway...${NC}"
railway up
echo -e "${GREEN}✅ Deployment started${NC}"
echo ""

# Step 6: Wait and check status
echo -e "${YELLOW}Step 6: Checking deployment status...${NC}"
echo "Waiting 30 seconds for deployment to initialize..."
sleep 30

railway status
echo ""

# Step 7: Get URL
echo -e "${YELLOW}Step 7: Getting deployment URL...${NC}"
RAILWAY_URL=$(railway domains | grep -oP 'https://[^ ]+' | head -1)

if [ ! -z "$RAILWAY_URL" ]; then
    echo -e "${GREEN}✅ Deployment URL: $RAILWAY_URL${NC}"
else
    echo -e "${YELLOW}⏳ URL not ready yet. Check with: railway domains${NC}"
fi

echo ""

# Step 8: Test health endpoint
echo -e "${YELLOW}Step 8: Testing health endpoint...${NC}"
if [ ! -z "$RAILWAY_URL" ]; then
    if curl -s "$RAILWAY_URL/health" | grep -q "healthy"; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${YELLOW}⏳ Health check not ready yet. Check logs with: railway logs${NC}"
    fi
fi

echo ""

# Step 9: Seed database
echo -e "${YELLOW}Step 9: Seeding lessons to database...${NC}"
read -p "Seed lessons now? (y/n): " -n 1 -r SEED
echo
if [[ $SEED =~ ^[Yy]$ ]]; then
    railway run python scripts/seed_lessons.py
    echo -e "${GREEN}✅ Lessons seeded${NC}"
fi

echo ""

# Step 10: Generate embeddings (optional)
echo -e "${YELLOW}Step 10: Generating embeddings...${NC}"
if [ ! -z "$QDRANT_URL" ] && [ ! -z "$OPENAI_API_KEY" ]; then
    read -p "Generate embeddings? (y/n): " -n 1 -r EMBED
    echo
    if [[ $EMBED =~ ^[Yy]$ ]]; then
        railway run python scripts/generate_embeddings.py
        echo -e "${GREEN}✅ Embeddings generated${NC}"
    fi
fi

echo ""
echo -e "${GREEN}=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "Your API is available at:"
if [ ! -z "$RAILWAY_URL" ]; then
    echo "  $RAILWAY_URL"
    echo ""
    echo "API Documentation:"
    echo "  $RAILWAY_URL/docs"
else
    echo "  Use 'railway domains' to get your URL"
fi
echo ""
echo "Next steps:"
echo "1. Update quantum-pages/.env.local with your API URL"
echo "2. Follow FRONTEND_INTEGRATION_GUIDE.md"
echo "3. Deploy frontend to Vercel"
echo ""
echo "View logs anytime with: railway logs"
echo "View status anytime with: railway status"
echo ""
