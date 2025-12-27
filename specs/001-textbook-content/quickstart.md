# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

**Feature**: 001-textbook-content
**Date**: 2025-12-12
**Purpose**: Developer setup and local development guide

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **Python**: 3.11 or higher
- **Git**: Latest stable version
- **Code Editor**: VS Code recommended (with Docusaurus, Python extensions)

### Required Accounts
- **GitHub Account**: For version control and Pages deployment
- **OpenAI API Key**: For embeddings and chatbot (text-embedding-3-small, GPT-4)
- **Neon Account**: Serverless Postgres database (free tier)
- **Qdrant Cloud Account**: Vector database (free tier, 1GB storage)
- **Railway Account** (optional): Backend deployment alternative to local dev

## Local Setup (15 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/learn-humanoid-robotics.git
cd learn-humanoid-robotics
```

### 2. Frontend Setup (Docusaurus)
```bash
cd website
npm install
npm run start
```
- Site opens at `http://localhost:3000`
- Hot reload enabled for MDX edits

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Environment Variables
Create `.env` files in both `website/` and `backend/`:

**`website/.env`**:
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BETTER_AUTH_CLIENT_ID=your_auth_client_id
```

**`backend/.env`**:
```bash
OPENAI_API_KEY=sk-proj-...
NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/textbook_db
QDRANT_URL=https://xxx-xxx.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
BETTER_AUTH_SECRET=generate_with_openssl_rand_hex_32
JWT_SECRET_KEY=generate_with_openssl_rand_hex_32
ENVIRONMENT=development
```

**Generate secrets**:
```bash
openssl rand -hex 32  # Run twice for two secrets
```

### 5. Database Initialization
```bash
cd backend
alembic upgrade head  # Run migrations
python scripts/seed_technical_glossary.py  # Bootstrap EN→UR glossary
```

### 6. Embed Initial Content
```bash
python scripts/embed_content.py --directory ../website/docs --language en
```
- Chunks all MDX files
- Generates embeddings via OpenAI
- Populates Qdrant collection `humanoid_robotics_textbook`

### 7. Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API available at `http://localhost:8000`
- Auto-generated docs: `http://localhost:8000/docs`

### 8. Verify Setup
Open browser to `http://localhost:3000`:
- ✅ Docusaurus site loads with navigation
- ✅ Click "Ask a Question" chatbot button
- ✅ Test query: "What is forward kinematics?"
- ✅ Response appears with source citations
- ✅ Click personalization button (top-right)
- ✅ Select persona → Content adapts

## Project Structure
```
learn-humanoid-robotics/
├── website/                      # Docusaurus frontend
│   ├── docs/                     # MDX content files
│   │   ├── 00-introduction/
│   │   ├── 01-physical-ai-intro/
│   │   ├── 02-ros2-fundamentals/
│   │   └── ...
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── PersonalizationButton.tsx
│   │   │   ├── UrduTranslateButton.tsx
│   │   │   └── RAGChatbot.tsx
│   │   ├── context/
│   │   │   └── PersonalizationContext.tsx
│   │   └── pages/                # Static pages
│   ├── static/                   # Images, diagrams
│   ├── docusaurus.config.js
│   └── sidebars.js
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── rag.py        # RAG endpoints
│   │   │       ├── auth.py       # Better-Auth integration
│   │   │       └── personalization.py
│   │   ├── models/               # Pydantic schemas
│   │   ├── services/
│   │   │   ├── rag/
│   │   │   │   ├── chunking.py
│   │   │   │   ├── embeddings.py
│   │   │   │   ├── retrieval.py
│   │   │   │   └── generation.py
│   │   │   └── translation/
│   │   │       └── urdu_translator.py
│   │   ├── database.py           # Postgres connection
│   │   └── main.py
│   ├── alembic/                  # Database migrations
│   ├── tests/                    # Pytest tests
│   └── requirements.txt
├── specs/                        # Specification documents
│   └── 001-textbook-content/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       └── contracts/
│           └── rag-api.yaml
├── history/
│   ├── prompts/                  # Prompt History Records (PHRs)
│   └── adr/                      # Architecture Decision Records
└── .specify/                     # Spec-Kit Plus templates
```

## Development Workflows

### Adding New Content Pages
1. Create MDX file in appropriate module directory (e.g., `website/docs/02-ros2-fundamentals/week-04-sensors.mdx`)
2. Add frontmatter:
   ```yaml
   ---
   title: Week 4 - Robot Sensors
   description: Understanding sensor integration in ROS 2
   sidebar_position: 4
   ---
   ```
3. Include interactive components:
   ```jsx
   import PersonalizationButton from '@site/src/components/PersonalizationButton';
   <PersonalizationButton />
   ```
4. Test locally: `npm run start` (hot reload)
5. Re-embed content: `python backend/scripts/embed_content.py --file website/docs/02-ros2-fundamentals/week-04-sensors.mdx`

### Translating Content to Urdu
1. Run Urdu Translator Agent:
   ```bash
   python backend/scripts/translate_to_urdu.py --input website/docs/02-ros2-fundamentals/ --output website/i18n/ur/docusaurus-plugin-content-docs/current/02-ros2-fundamentals/
   ```
2. Review technical terms in `backend/data/technical_glossary.csv`
3. Test RTL layout: `npm run start -- --locale ur`

### Testing RAG Chatbot Locally
1. Start backend: `uvicorn app.main:app --reload`
2. Test endpoint with curl:
   ```bash
   curl -X POST http://localhost:8000/api/rag/query \
     -H "Content-Type: application/json" \
     -d '{"query": "Explain inverse kinematics", "language": "en", "top_k": 5}'
   ```
3. Run backend tests: `pytest backend/tests/`

### Running Full Build
```bash
# Frontend production build
cd website
npm run build
npm run serve  # Test production build locally

# Backend tests with coverage
cd backend
pytest --cov=app --cov-report=html
```

## Common Issues

### Issue 1: Chatbot Not Responding
**Symptoms**: Spinner indefinitely, no response
**Fix**:
1. Check backend logs: `uvicorn app.main:app --reload --log-level debug`
2. Verify `OPENAI_API_KEY` is valid
3. Check Qdrant collection exists: `python backend/scripts/check_qdrant.py`

### Issue 2: Personalization Not Persisting
**Symptoms**: Preferences reset on page reload
**Fix**:
1. Check localStorage: Open DevTools → Application → Local Storage → `robotics_textbook_user_prefs`
2. If authenticated, verify JWT token: `curl http://localhost:8000/api/personalization/profile -H "Authorization: Bearer YOUR_TOKEN"`

### Issue 3: Urdu Text Rendering Issues
**Symptoms**: Broken RTL layout, missing characters
**Fix**:
1. Ensure Noto Nastaliq Urdu font loaded in `docusaurus.config.js`:
   ```js
   stylesheets: [
     'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap'
   ]
   ```
2. Verify `direction: 'rtl'` in i18n config

### Issue 4: Embedding Pipeline Fails
**Symptoms**: `OpenAIError: Rate limit exceeded`
**Fix**:
1. Add rate limiting to `backend/app/services/rag/embeddings.py`:
   ```python
   import time
   time.sleep(1)  # 1 second delay between chunks
   ```
2. Use batch embedding (20 chunks per request)

## Testing Checklist
Before committing code, verify:
- [ ] `npm run build` succeeds (frontend)
- [ ] `pytest backend/tests/` passes (backend)
- [ ] Lighthouse audit >90 performance: `npm run build && npm run serve` → Run Lighthouse
- [ ] No broken links: `npm run build` (Docusaurus validates automatically)
- [ ] Chatbot responds within 3 seconds
- [ ] Personalization updates reflect immediately
- [ ] Urdu translation loads correctly: `npm run start -- --locale ur`

## Next Steps
1. **Read the Specification**: `specs/001-textbook-content/spec.md` for full feature requirements
2. **Review Implementation Plan**: `specs/001-textbook-content/plan.md` for task breakdown
3. **Execute Tasks**: Run `/sp.tasks` to generate dependency-ordered tasks
4. **Deploy to Production**: Follow `specs/001-textbook-content/plan.md` Phase 2.8 (Deployment & CI/CD)

## Additional Resources
- **Docusaurus Documentation**: https://docusaurus.io/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **Better-Auth Documentation**: https://www.better-auth.com/docs
- **Qdrant Documentation**: https://qdrant.tech/documentation
- **OpenAI Embeddings Guide**: https://platform.openai.com/docs/guides/embeddings
- **Constitution**: `.specify/memory/constitution.md`
- **RAG API Spec**: `specs/001-textbook-content/contracts/rag-api.yaml`

## Support
For issues or questions:
1. Check existing PHRs: `history/prompts/001-textbook-content/`
2. Review ADRs: `history/adr/`
3. Create GitHub issue with reproduction steps

---

**Last Updated**: 2025-12-12
**Version**: 1.0.0
**Maintained By**: Claude Code Agent System
