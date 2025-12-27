# Implementation Plan: Physical AI & Humanoid Robotics Interactive Textbook

**Branch**: `001-textbook-content` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-textbook-content/spec.md`

## Summary

Build a comprehensive Docusaurus-based interactive textbook for teaching Physical AI & Humanoid Robotics (13-week curriculum) with integrated RAG chatbot, personalization engine, Urdu translation, Better-Auth authentication, and automated deployment to GitHub Pages. Content generated using 7 specialized Claude Code subagents following Spec-Kit Plus workflow.

**Technical Approach** (from research.md):
- Frontend: Docusaurus v3.x with MDX, React Context for personalization
- Backend: FastAPI with async/await for RAG queries
- Databases: Neon Postgres (users, preferences) + Qdrant (embeddings)
- Deployment: GitHub Pages (frontend) + Railway (backend)
- Content Generation: 7 specialized Claude Code subagents + reusable skills

## Technical Context

**Language/Version**: 
- Python 3.11+ (backend FastAPI)
- Node.js 18+ (Docusaurus build)
- TypeScript 5.x (React components)

**Primary Dependencies**:
- Docusaurus v3.x, React 18.x, Better-Auth
- FastAPI, Pydantic, OpenAI SDK, Qdrant Client
- Neon Serverless Postgres, Alembic (migrations)

**Storage**:
- Neon Postgres: Users, preferences, chat history, content metadata, technical glossary
- Qdrant Free Tier: Vector embeddings (1536-dim)
- GitHub: Source code, static assets, deployment artifacts

**Testing**:
- Frontend: Jest + React Testing Library
- Backend: pytest with async support
- E2E: Playwright for critical user flows
- Content: Link validation, MDX syntax checking

**Target Platform**:
- Frontend: Modern browsers (Chrome, Firefox, Safari, Edge)
- Backend: Linux server (Railway/Render)
- Deployment: GitHub Pages (static hosting)

**Project Type**: Web (monorepo with frontend + backend)

**Performance Goals**:
- Page load: <2s (p95) on 3G
- RAG query response: <3s (p95)
- Docusaurus build: <5min
- Concurrent users: 100+ without degradation

**Constraints**:
- Backend API latency: <200ms p95
- Lighthouse scores: Performance >90, Accessibility >95
- Free tier limits: Qdrant 1M vectors, Railway 512MB RAM

**Scale/Scope**:
- 13 weeks × ~20 pages = 260+ textbook pages
- ~800 content chunks for RAG
- 6 major chapters + 4 modules
- 7 specialized agents + ~15 reusable skills

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Fidelity ✅
- All textbook content derived from PDF curriculum (9 pages of detailed course structure)
- No hallucinated content permitted in educational modules
- Content Writer Agent cites PDF sections for each generated page
- **COMPLIANT**: Research.md documents PDF as authoritative source

### Principle II: Modularity & Reusability ✅
- 7 specialized agents with clear interfaces (ContentWriter, LayoutBuilder, RAGBuilder, BetterAuthIntegrator, UrduTranslator, PersonalizationEngine, GitHubDeployer)
- Reusable skills: generate-mdx, chunk-markdown, translate-content, etc.
- Docusaurus pages follow MDX module pattern
- **COMPLIANT**: Multi-agent architecture in research.md, skills library planned

### Principle III: Multi-Agent Orchestration ✅
- Complex tasks decomposed to specialized subagents
- Agents communicate through well-defined schemas (JSON input/output)
- Atomic, verifiable outputs per agent
- **COMPLIANT**: 7 agents specified with clear responsibilities

### Principle IV: Accessibility & Internationalization ✅
- Urdu translation via Docusaurus i18n (RTL support)
- WCAG 2.1 Level AA compliance (Lighthouse >95)
- Personalization respects user preferences
- **COMPLIANT**: Urdu workflow in research.md, accessibility testing planned

### Principle V: Test-Driven Development (NON-NEGOTIABLE) ✅
- Backend TDD: Write tests → Red → Green → Refactor
- Content validation: Link checking, MDX syntax, schema compliance
- Testing strategy in research.md covers all layers
- **COMPLIANT**: Multi-layer testing defined (content, unit, integration, perf, a11y)

### Principle VI: Observability & Debugging ✅
- Structured JSON logs with correlation IDs
- FastAPI middleware for request tracing
- RAG queries log: query, chunks, response time
- **COMPLIANT**: Observability mentioned in research decisions

### Principle VII: Version Control & Semantic Versioning ✅
- Semantic versioning (MAJOR.MINOR.PATCH) for all artifacts
- Git trunk-based development with feature branches
- **COMPLIANT**: Version strategy documented

### Principle VIII: Security & Privacy ✅
- Better-Auth with bcrypt (12 rounds)
- PII encrypted at rest (Neon Postgres)
- No user data leakage across sessions
- Secrets in environment variables (never committed)
- **COMPLIANT**: Security decisions in research.md, auth schema in data-model.md

**GATE STATUS**: ✅ ALL PRINCIPLES COMPLIANT

## Project Structure

### Documentation (this feature)

```text
specs/001-textbook-content/
├── spec.md              # Feature specification (COMPLETED)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (COMPLETED)
├── data-model.md        # Phase 1 output (COMPLETED)
├── quickstart.md        # Phase 1 output (PENDING)
├── contracts/           # Phase 1 output
│   └── rag-api.yaml     # RAG API OpenAPI spec (COMPLETED)
├── checklists/
│   └── requirements.md  # Spec quality checklist (COMPLETED)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
learn-humanoid-robotics/
├── .claude/
│   ├── agents/                    # Subagent definitions
│   │   ├── content-writer.md
│   │   ├── docusaurus-layout.md
│   │   ├── rag-builder.md
│   │   ├── better-auth-integrator.md
│   │   ├── urdu-translator.md
│   │   ├── personalization-engine.md
│   │   └── github-deployment.md
│   ├── skills/                    # Reusable skills
│   │   ├── generate-mdx.skill.md
│   │   ├── chunk-markdown.skill.md
│   │   ├── generate-embeddings.skill.md
│   │   ├── translate-content.skill.md
│   │   ├── generate-sidebar.skill.md
│   │   └── validate-links.skill.md
│   └── commands/                  # Already present (sp.* commands)
│
├── website/                       # Docusaurus frontend
│   ├── docs/                      # Main textbook content (MDX)
│   │   ├── 00-introduction/
│   │   │   ├── index.mdx
│   │   │   ├── course-overview.mdx
│   │   │   ├── learning-outcomes.mdx
│   │   │   └── why-physical-ai.mdx
│   │   ├── 01-physical-ai-intro/ # Weeks 1-2
│   │   │   ├── index.mdx
│   │   │   ├── foundations.mdx
│   │   │   ├── digital-to-physical.mdx
│   │   │   ├── humanoid-landscape.mdx
│   │   │   └── sensor-systems.mdx
│   │   ├── 02-ros2-fundamentals/ # Weeks 3-5
│   │   │   ├── index.mdx
│   │   │   ├── architecture.mdx
│   │   │   ├── nodes-topics-services.mdx
│   │   │   ├── building-packages.mdx
│   │   │   └── launch-files.mdx
│   │   ├── 03-gazebo-simulation/ # Weeks 6-7
│   │   │   ├── index.mdx
│   │   │   ├── environment-setup.mdx
│   │   │   ├── urdf-sdf.mdx
│   │   │   ├── physics-simulation.mdx
│   │   │   └── unity-visualization.mdx
│   │   ├── 04-nvidia-isaac/      # Weeks 8-10
│   │   │   ├── index.mdx
│   │   │   ├── isaac-sdk.mdx
│   │   │   ├── perception-manipulation.mdx
│   │   │   ├── reinforcement-learning.mdx
│   │   │   └── sim-to-real.mdx
│   │   ├── 05-humanoid-development/ # Weeks 11-12
│   │   │   ├── index.mdx
│   │   │   ├── kinematics-dynamics.mdx
│   │   │   ├── bipedal-locomotion.mdx
│   │   │   ├── manipulation-grasping.mdx
│   │   │   └── human-robot-interaction.mdx
│   │   ├── 06-conversational-robotics/ # Week 13
│   │   │   ├── index.mdx
│   │   │   ├── gpt-integration.mdx
│   │   │   ├── speech-recognition.mdx
│   │   │   └── multimodal-interaction.mdx
│   │   ├── 07-hardware-requirements/
│   │   │   ├── index.mdx
│   │   │   ├── digital-twin-workstation.mdx
│   │   │   ├── jetson-kit.mdx
│   │   │   ├── robot-lab-options.mdx
│   │   │   └── cloud-native-lab.mdx
│   │   ├── 08-assessments/
│   │   │   ├── index.mdx
│   │   │   ├── ros2-project.mdx
│   │   │   ├── gazebo-simulation.mdx
│   │   │   └── isaac-perception-pipeline.mdx
│   │   └── 09-capstone/
│   │       ├── index.mdx
│   │       ├── autonomous-humanoid.mdx
│   │       ├── requirements.mdx
│   │       └── evaluation.mdx
│   ├── i18n/ur/                   # Urdu translations
│   │   ├── docusaurus-plugin-content-docs/
│   │   │   └── current/           # Mirror of docs/ in Urdu
│   │   └── glossary-en-ur.json    # Technical term glossary
│   ├── src/
│   │   ├── components/
│   │   │   ├── PersonalizationButton.tsx
│   │   │   ├── UrduTranslateButton.tsx
│   │   │   ├── RAGChatbot.tsx
│   │   │   └── AuthWidget.tsx
│   │   ├── context/
│   │   │   └── PersonalizationContext.tsx
│   │   ├── hooks/
│   │   │   └── usePersonalization.ts
│   │   ├── theme/
│   │   │   └── Root.tsx           # Docusaurus theme wrapper
│   │   ├── css/
│   │   │   └── custom.css
│   │   └── pages/
│   │       ├── index.tsx          # Landing page
│   │       └── login.tsx          # Auth page
│   ├── static/
│   │   ├── img/
│   │   │   ├── diagrams/
│   │   │   ├── hardware/
│   │   │   └── robots/
│   │   └── pdf/
│   │       └── source-curriculum.pdf
│   ├── docusaurus.config.js
│   ├── sidebars.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── rag.py
│   │   │   │   ├── personalization.py
│   │   │   │   └── translation.py
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── logging.py
│   │   ├── services/
│   │   │   ├── rag/
│   │   │   │   ├── chunking.py
│   │   │   │   ├── embeddings.py
│   │   │   │   ├── vectorstore.py
│   │   │   │   └── generation.py
│   │   │   ├── auth/
│   │   │   │   ├── better_auth.py
│   │   │   │   └── session.py
│   │   │   └── translation/
│   │   │       └── urdu_translator.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── content.py
│   │   │   └── personalization.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── rag.py
│   │   │   └── personalization.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_rag.py
│   │   ├── test_personalization.py
│   │   └── test_translation.py
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 001_initial_schema.py
│   │   └── env.py
│   ├── requirements.txt
│   ├── .env.example
│   └── pytest.ini
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       ├── deploy-backend.yml
│       └── run-tests.yml
│
├── README.md
├── .gitignore
└── .env.example
```

## Phase 0: Research ✅ COMPLETED

**Deliverable**: `research.md` (10 sections, all technical unknowns resolved)

**Key Decisions**:
1. 13-week module-based content structure
2. Semantic chunking (512 tokens + 50 overlap)
3. OpenAI text-embedding-3-small for embeddings
4. FastAPI + Neon Postgres + Qdrant
5. Client-side personalization with React Context
6. AI-assisted translation with technical glossary
7. Better-Auth with custom signup questions
8. GitHub Pages + Railway deployment
9. 7 specialized Claude Code subagents
10. Multi-layer testing strategy

**Status**: ✅ All NEEDS CLARIFICATION items resolved

## Phase 1: Design ✅ COMPLETED

**Deliverables**:
1. ✅ `data-model.md` - Entities, Postgres/Qdrant schemas
2. ✅ `contracts/rag-api.yaml` - OpenAPI spec for RAG endpoints
3. ⏳ `quickstart.md` - Getting started guide (PENDING)

**Next**: Complete quickstart.md, then update agent context

## Phase 2: Implementation Plan (Detailed Task Breakdown)

### Phase 2.1: Project Initialization (Parallelizable)

**Task 001**: Initialize Docusaurus Project
- **Agent**: DocusaurusLayoutAgent
- **Creates**:
  - `website/` directory
  - `website/package.json`
  - `website/docusaurus.config.js`
  - `website/sidebars.js`
  - `website/tsconfig.json`
- **Skills**: `initialize-docusaurus`, `configure-i18n`
- **Depends On**: None
- **Duration**: 15 minutes
- **Auto-Generated**: Yes

**Task 002**: Initialize FastAPI Backend
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/main.py`
  - `backend/requirements.txt`
  - `backend/.env.example`
  - `backend/pytest.ini`
- **Skills**: `initialize-fastapi`, `setup-cors`
- **Depends On**: None
- **Duration**: 20 minutes
- **Auto-Generated**: Yes

**Task 003**: Setup Database Migrations
- **Agent**: BetterAuthIntegratorAgent
- **Creates**:
  - `backend/alembic/` directory
  - `backend/alembic/versions/001_initial_schema.py`
  - `backend/alembic/env.py`
- **Skills**: `setup-alembic`, `create-migration`
- **Depends On**: Task 002
- **Duration**: 25 minutes
- **Auto-Generated**: Yes

**Task 004**: Create Qdrant Collection
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/services/rag/vectorstore.py`
  - Collection `humanoid_robotics_textbook` in Qdrant
- **Skills**: `setup-qdrant`, `create-collection`
- **Depends On**: None
- **Duration**: 15 minutes
- **Auto-Generated**: Yes

**Task 005**: Bootstrap Technical Glossary (EN→UR)
- **Agent**: UrduTranslatorAgent
- **Creates**:
  - `website/i18n/glossary-en-ur.json` (200 initial terms)
- **Skills**: `bootstrap-glossary`, `validate-glossary`
- **Depends On**: None
- **Duration**: 30 minutes (includes manual review)
- **Auto-Generated**: Partial (AI generates, human reviews)

### Phase 2.2: Content Generation (Week-by-Week)

**Task 100**: Generate Week 1-2 Content (Physical AI Intro)
- **Agent**: ContentWriterAgent
- **Input**: PDF pages 3-4 (Weeks 1-2 section)
- **Creates**:
  - `website/docs/01-physical-ai-intro/index.mdx`
  - `website/docs/01-physical-ai-intro/foundations.mdx`
  - `website/docs/01-physical-ai-intro/digital-to-physical.mdx`
  - `website/docs/01-physical-ai-intro/humanoid-landscape.mdx`
  - `website/docs/01-physical-ai-intro/sensor-systems.mdx`
- **Skills**: `generate-mdx`, `extract-code-blocks`, `create-mermaid-diagram`
- **Depends On**: Task 001
- **Duration**: 45 minutes
- **Auto-Generated**: Yes

**Task 101**: Generate Week 3-5 Content (ROS 2 Fundamentals)
- **Agent**: ContentWriterAgent
- **Input**: PDF page 4 (Weeks 3-5 section)
- **Creates**:
  - `website/docs/02-ros2-fundamentals/index.mdx`
  - `website/docs/02-ros2-fundamentals/architecture.mdx`
  - `website/docs/02-ros2-fundamentals/nodes-topics-services.mdx`
  - `website/docs/02-ros2-fundamentals/building-packages.mdx`
  - `website/docs/02-ros2-fundamentals/launch-files.mdx`
- **Skills**: `generate-mdx`, `extract-code-blocks`, `create-mermaid-diagram`
- **Depends On**: Task 001
- **Duration**: 50 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Task 100

**Task 102**: Generate Week 6-7 Content (Gazebo Simulation)
- **Agent**: ContentWriterAgent
- **Input**: PDF page 4 (Weeks 6-7 section)
- **Creates**:
  - `website/docs/03-gazebo-simulation/index.mdx`
  - `website/docs/03-gazebo-simulation/environment-setup.mdx`
  - `website/docs/03-gazebo-simulation/urdf-sdf.mdx`
  - `website/docs/03-gazebo-simulation/physics-simulation.mdx`
  - `website/docs/03-gazebo-simulation/unity-visualization.mdx`
- **Skills**: `generate-mdx`, `create-mermaid-diagram`
- **Depends On**: Task 001
- **Duration**: 45 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100, 101

**Task 103**: Generate Week 8-10 Content (NVIDIA Isaac)
- **Agent**: ContentWriterAgent
- **Input**: PDF page 4 (Weeks 8-10 section)
- **Creates**:
  - `website/docs/04-nvidia-isaac/index.mdx`
  - `website/docs/04-nvidia-isaac/isaac-sdk.mdx`
  - `website/docs/04-nvidia-isaac/perception-manipulation.mdx`
  - `website/docs/04-nvidia-isaac/reinforcement-learning.mdx`
  - `website/docs/04-nvidia-isaac/sim-to-real.mdx`
- **Skills**: `generate-mdx`, `extract-code-blocks`
- **Depends On**: Task 001
- **Duration**: 50 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100, 101, 102

**Task 104**: Generate Week 11-12 Content (Humanoid Development)
- **Agent**: ContentWriterAgent
- **Input**: PDF page 4 (Weeks 11-12 section)
- **Creates**:
  - `website/docs/05-humanoid-development/index.mdx`
  - `website/docs/05-humanoid-development/kinematics-dynamics.mdx`
  - `website/docs/05-humanoid-development/bipedal-locomotion.mdx`
  - `website/docs/05-humanoid-development/manipulation-grasping.mdx`
  - `website/docs/05-humanoid-development/human-robot-interaction.mdx`
- **Skills**: `generate-mdx`, `create-mermaid-diagram`
- **Depends On**: Task 001
- **Duration**: 45 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-103

**Task 105**: Generate Week 13 Content (Conversational Robotics)
- **Agent**: ContentWriterAgent
- **Input**: PDF page 4 (Week 13 section)
- **Creates**:
  - `website/docs/06-conversational-robotics/index.mdx`
  - `website/docs/06-conversational-robotics/gpt-integration.mdx`
  - `website/docs/06-conversational-robotics/speech-recognition.mdx`
  - `website/docs/06-conversational-robotics/multimodal-interaction.mdx`
- **Skills**: `generate-mdx`, `extract-code-blocks`
- **Depends On**: Task 001
- **Duration**: 40 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-104

**Task 106**: Generate Hardware Requirements Content
- **Agent**: ContentWriterAgent
- **Input**: PDF pages 5-9 (Hardware Requirements, Architecture, Jetson Kit, Robot Lab, Cloud-Native)
- **Creates**:
  - `website/docs/07-hardware-requirements/index.mdx`
  - `website/docs/07-hardware-requirements/digital-twin-workstation.mdx`
  - `website/docs/07-hardware-requirements/jetson-kit.mdx`
  - `website/docs/07-hardware-requirements/robot-lab-options.mdx`
  - `website/docs/07-hardware-requirements/cloud-native-lab.mdx`
- **Skills**: `generate-mdx`, `create-tables`
- **Depends On**: Task 001
- **Duration**: 60 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-105

**Task 107**: Generate Assessments Content
- **Agent**: ContentWriterAgent
- **Input**: PDF page 5 (Assessments section)
- **Creates**:
  - `website/docs/08-assessments/index.mdx`
  - `website/docs/08-assessments/ros2-project.mdx`
  - `website/docs/08-assessments/gazebo-simulation.mdx`
  - `website/docs/08-assessments/isaac-perception-pipeline.mdx`
- **Skills**: `generate-mdx`
- **Depends On**: Task 001
- **Duration**: 35 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-106

**Task 108**: Generate Capstone Project Content
- **Agent**: ContentWriterAgent
- **Input**: PDF page 3 (Module 4: VLA + Capstone Project)
- **Creates**:
  - `website/docs/09-capstone/index.mdx`
  - `website/docs/09-capstone/autonomous-humanoid.mdx`
  - `website/docs/09-capstone/requirements.mdx`
  - `website/docs/09-capstone/evaluation.mdx`
- **Skills**: `generate-mdx`, `create-mermaid-diagram`
- **Depends On**: Task 001
- **Duration**: 45 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-107

**Task 109**: Generate Introduction Content
- **Agent**: ContentWriterAgent
- **Input**: PDF pages 3-4 (Quarter Overview, Why Physical AI Matters, Learning Outcomes)
- **Creates**:
  - `website/docs/00-introduction/index.mdx`
  - `website/docs/00-introduction/course-overview.mdx`
  - `website/docs/00-introduction/learning-outcomes.mdx`
  - `website/docs/00-introduction/why-physical-ai.mdx`
- **Skills**: `generate-mdx`
- **Depends On**: Task 001
- **Duration**: 35 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 100-108

### Phase 2.3: Frontend Components & Personalization

**Task 200**: Create Personalization Context
- **Agent**: PersonalizationEngineAgent
- **Creates**:
  - `website/src/context/PersonalizationContext.tsx`
  - `website/src/hooks/usePersonalization.ts`
- **Skills**: `create-react-context`, `create-custom-hook`
- **Depends On**: Task 001
- **Duration**: 30 minutes
- **Auto-Generated**: Yes

**Task 201**: Create PersonalizationButton Component
- **Agent**: PersonalizationEngineAgent
- **Creates**:
  - `website/src/components/PersonalizationButton.tsx`
  - Modal UI for profile selection
- **Skills**: `create-react-component`, `create-modal-ui`
- **Depends On**: Task 200
- **Duration**: 45 minutes
- **Auto-Generated**: Yes

**Task 202**: Create UrduTranslateButton Component
- **Agent**: UrduTranslatorAgent
- **Creates**:
  - `website/src/components/UrduTranslateButton.tsx`
  - Language toggle logic
- **Skills**: `create-react-component`, `handle-i18n-toggle`
- **Depends On**: Task 001
- **Duration**: 25 minutes
- **Auto-Generated**: Yes

**Task 203**: Create RAGChatbot Component
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `website/src/components/RAGChatbot.tsx`
  - Chat widget UI (floating, collapsible)
- **Skills**: `create-react-component`, `create-chat-ui`
- **Depends On**: Task 001
- **Duration**: 60 minutes
- **Auto-Generated**: Yes

**Task 204**: Create AuthWidget Component
- **Agent**: BetterAuthIntegratorAgent
- **Creates**:
  - `website/src/components/AuthWidget.tsx`
  - Login/signup modal
- **Skills**: `create-react-component`, `create-auth-form`
- **Depends On**: Task 001
- **Duration**: 50 minutes
- **Auto-Generated**: Yes

**Task 205**: Create Docusaurus Theme Root Wrapper
- **Agent**: DocusaurusLayoutAgent
- **Creates**:
  - `website/src/theme/Root.tsx`
  - Wraps site with PersonalizationContext, auth provider
- **Skills**: `create-theme-wrapper`, `inject-global-components`
- **Depends On**: Tasks 200, 203, 204
- **Duration**: 20 minutes
- **Auto-Generated**: Yes

**Task 206**: Add Personalization Buttons to Chapter Templates
- **Agent**: PersonalizationEngineAgent
- **Updates**:
  - All chapter `index.mdx` files (add `<PersonalizationButton />` at top)
- **Skills**: `inject-component-to-mdx`
- **Depends On**: Tasks 100-109, Task 201
- **Duration**: 15 minutes
- **Auto-Generated**: Yes

### Phase 2.4: Backend RAG Implementation

**Task 300**: Implement Content Chunking Service
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/services/rag/chunking.py`
  - Semantic chunking logic (512 tokens + 50 overlap)
- **Skills**: `implement-chunking`, `parse-mdx`
- **Depends On**: Task 002
- **Duration**: 40 minutes
- **Auto-Generated**: Yes

**Task 301**: Implement Embedding Service
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/services/rag/embeddings.py`
  - OpenAI API integration, batch processing
- **Skills**: `implement-embeddings`, `handle-api-rate-limits`
- **Depends On**: Task 002
- **Duration**: 35 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Task 300

**Task 302**: Implement Vectorstore Service
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/services/rag/vectorstore.py`
  - Qdrant client, search methods
- **Skills**: `implement-vectorstore`, `create-search-methods`
- **Depends On**: Task 004
- **Duration**: 45 minutes
- **Auto-Generated**: Yes

**Task 303**: Implement RAG Generation Service
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/services/rag/generation.py`
  - OpenAI chat completions, prompt templates
- **Skills**: `implement-rag-generation`, `create-prompt-template`
- **Depends On**: Task 002
- **Duration**: 50 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 300, 301, 302

**Task 304**: Implement RAG API Endpoints
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/api/routes/rag.py`
  - Endpoints: /query, /query-selection, /embed-content, /health
- **Skills**: `create-fastapi-routes`, `add-request-validation`
- **Depends On**: Tasks 300, 301, 302, 303
- **Duration**: 60 minutes
- **Auto-Generated**: Yes

**Task 305**: Embed All Textbook Content
- **Agent**: RAGBuilderAgent
- **Executes**:
  - Run embedding script on all generated MDX files
  - Populate Qdrant collection
- **Skills**: `run-embedding-pipeline`, `monitor-progress`
- **Depends On**: Tasks 100-109, Task 304
- **Duration**: 20 minutes (runtime)
- **Auto-Generated**: Yes

### Phase 2.5: Authentication & Personalization Backend

**Task 400**: Implement Better-Auth Integration
- **Agent**: BetterAuthIntegratorAgent
- **Creates**:
  - `backend/app/services/auth/better_auth.py`
  - Auth config, providers setup
- **Skills**: `setup-better-auth`, `configure-providers`
- **Depends On**: Task 002
- **Duration**: 45 minutes
- **Auto-Generated**: Yes

**Task 401**: Implement Auth API Endpoints
- **Agent**: BetterAuthIntegratorAgent
- **Creates**:
  - `backend/app/api/routes/auth.py`
  - Endpoints: /signup, /login, /logout, /refresh
- **Skills**: `create-auth-endpoints`, `add-signup-questions`
- **Depends On**: Task 400
- **Duration**: 55 minutes
- **Auto-Generated**: Yes

**Task 402**: Implement Personalization API Endpoints
- **Agent**: PersonalizationEngineAgent
- **Creates**:
  - `backend/app/api/routes/personalization.py`
  - Endpoints: GET/PUT /profile
- **Skills**: `create-preference-endpoints`, `handle-localStorage-sync`
- **Depends On**: Task 003
- **Duration**: 35 minutes
- **Auto-Generated**: Yes

**Task 403**: Create Database Models
- **Agent**: BetterAuthIntegratorAgent
- **Creates**:
  - `backend/app/models/user.py`
  - `backend/app/models/personalization.py`
  - `backend/app/models/content.py`
- **Skills**: `create-sqlalchemy-models`, `add-relationships`
- **Depends On**: Task 003
- **Duration**: 40 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 400, 401, 402

**Task 404**: Create Pydantic Schemas
- **Agent**: RAGBuilderAgent
- **Creates**:
  - `backend/app/schemas/auth.py`
  - `backend/app/schemas/rag.py`
  - `backend/app/schemas/personalization.py`
- **Skills**: `create-pydantic-schemas`, `add-validation-rules`
- **Depends On**: Task 002
- **Duration**: 30 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Task 403

### Phase 2.6: Urdu Translation

**Task 500**: Translate All Chapter Content to Urdu
- **Agent**: UrduTranslatorAgent
- **Input**: All English MDX files from Tasks 100-109
- **Creates**:
  - `website/i18n/ur/docusaurus-plugin-content-docs/current/` (mirror structure)
  - ~260+ Urdu MDX files
- **Skills**: `translate-content`, `preserve-mdx-structure`, `update-glossary`
- **Depends On**: Tasks 100-109, Task 005
- **Duration**: 180 minutes (AI-assisted, requires human review)
- **Auto-Generated**: Partial (AI translates, human reviews technical terms)

**Task 501**: Configure Docusaurus i18n
- **Agent**: DocusaurusLayoutAgent
- **Updates**:
  - `website/docusaurus.config.js` (add Urdu locale config)
- **Skills**: `configure-i18n`, `add-rtl-support`
- **Depends On**: Task 001
- **Duration**: 15 minutes
- **Auto-Generated**: Yes

### Phase 2.7: Deployment Setup

**Task 600**: Create GitHub Actions Workflow (Frontend)
- **Agent**: GitHubDeploymentAgent
- **Creates**:
  - `.github/workflows/deploy-frontend.yml`
  - Build, test, deploy to GitHub Pages
- **Skills**: `generate-gh-workflow`, `validate-yaml`
- **Depends On**: None
- **Duration**: 30 minutes
- **Auto-Generated**: Yes

**Task 601**: Create GitHub Actions Workflow (Backend)
- **Agent**: GitHubDeploymentAgent
- **Creates**:
  - `.github/workflows/deploy-backend.yml`
  - Test, deploy to Railway
- **Skills**: `generate-gh-workflow`, `configure-railway-deploy`
- **Depends On**: None
- **Duration**: 25 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Task 600

**Task 602**: Create GitHub Actions Workflow (Tests)
- **Agent**: GitHubDeploymentAgent
- **Creates**:
  - `.github/workflows/run-tests.yml`
  - Run all tests on PR
- **Skills**: `generate-gh-workflow`, `configure-test-matrix`
- **Depends On**: None
- **Duration**: 20 minutes
- **Auto-Generated**: Yes
- **Parallel With**: Tasks 600, 601

**Task 603**: Configure Railway Deployment
- **Agent**: GitHubDeploymentAgent
- **Creates**:
  - `railway.json` (Railway config)
  - Environment variable templates
- **Skills**: `create-railway-config`, `document-env-vars`
- **Depends On**: None
- **Duration**: 15 minutes
- **Auto-Generated**: Yes

**Task 604**: Configure GitHub Pages
- **Agent**: GitHubDeploymentAgent
- **Executes**:
  - Enable GitHub Pages in repo settings
  - Set source to `gh-pages` branch
- **Skills**: `configure-gh-pages`
- **Depends On**: Task 600
- **Duration**: 5 minutes
- **Auto-Generated**: Manual (requires repo admin)

### Phase 2.8: Testing & Validation

**Task 700**: Write Backend Unit Tests
- **Agent**: RAGBuilderAgent + BetterAuthIntegratorAgent
- **Creates**:
  - `backend/tests/test_rag.py`
  - `backend/tests/test_auth.py`
  - `backend/tests/test_personalization.py`
- **Skills**: `write-pytest-tests`, `create-test-fixtures`
- **Depends On**: Tasks 300-304, Tasks 400-402
- **Duration**: 90 minutes
- **Auto-Generated**: Partial (agent generates test stubs, human writes assertions)

**Task 701**: Write Frontend Component Tests
- **Agent**: PersonalizationEngineAgent
- **Creates**:
  - `website/src/components/__tests__/PersonalizationButton.test.tsx`
  - `website/src/components/__tests__/RAGChatbot.test.tsx`
  - `website/src/components/__tests__/AuthWidget.test.tsx`
- **Skills**: `write-react-tests`, `create-test-utils`
- **Depends On**: Tasks 201, 203, 204
- **Duration**: 60 minutes
- **Auto-Generated**: Partial

**Task 702**: Run Content Validation
- **Agent**: DocusaurusLayoutAgent
- **Executes**:
  - Check all internal links
  - Validate MDX syntax
  - Verify all images exist
- **Skills**: `validate-links`, `validate-mdx`, `check-assets`
- **Depends On**: Tasks 100-109
- **Duration**: 10 minutes (runtime)
- **Auto-Generated**: Yes

**Task 703**: Run Lighthouse Audits
- **Agent**: GitHubDeploymentAgent
- **Executes**:
  - Performance, Accessibility, SEO, Best Practices audits
  - Generate reports
- **Skills**: `run-lighthouse`, `generate-audit-report`
- **Depends On**: Task 604 (after first deployment)
- **Duration**: 15 minutes (runtime)
- **Auto-Generated**: Yes

### Phase 2.9: Documentation & Quickstart

**Task 800**: Create Quickstart Guide
- **Agent**: DocusaurusLayoutAgent
- **Creates**:
  - `specs/001-textbook-content/quickstart.md`
  - Setup instructions for developers
- **Skills**: `write-quickstart`, `document-setup-steps`
- **Depends On**: All previous tasks
- **Duration**: 45 minutes
- **Auto-Generated**: Yes

**Task 801**: Create README.md
- **Agent**: GitHubDeploymentAgent
- **Creates**:
  - `README.md` (project overview, setup, deployment)
- **Skills**: `write-readme`, `add-badges`
- **Depends On**: Task 800
- **Duration**: 30 minutes
- **Auto-Generated**: Yes

### Phase 2.10: Final Integration & Deployment

**Task 900**: Run Full Integration Test
- **Agent**: Manual (developer)
- **Executes**:
  - Test complete user journey (signup → personalize → chat → translate)
  - Verify all features work end-to-end
- **Depends On**: All previous tasks
- **Duration**: 30 minutes (runtime)
- **Auto-Generated**: No

**Task 901**: Deploy to Production
- **Agent**: GitHubDeploymentAgent
- **Executes**:
  - Merge to `main` branch
  - Trigger GitHub Actions workflows
  - Verify deployments (frontend + backend)
- **Depends On**: Task 900
- **Duration**: 10 minutes (runtime)
- **Auto-Generated**: Yes

**Task 902**: Create Demo Video
- **Agent**: Manual (user)
- **Executes**:
  - Record 90-second demo video
  - Upload to YouTube/NotebookLM
- **Depends On**: Task 901
- **Duration**: 60 minutes
- **Auto-Generated**: No

## Execution Summary

### Total Tasks: 53
- **Auto-Generated**: 47 (89%)
- **Manual/Partial**: 6 (11%)

### Parallelizable Tasks:
- Tasks 100-109 (Content generation) - 9 parallel
- Tasks 300-303 (RAG services) - 4 parallel
- Tasks 400-404 (Auth/personalization) - 5 parallel
- Tasks 600-603 (Deployment workflows) - 4 parallel

### Estimated Timeline:
- **Phase 2.1 (Init)**: 1.5 hours
- **Phase 2.2 (Content)**: 4 hours (parallelized)
- **Phase 2.3 (Frontend)**: 3 hours
- **Phase 2.4 (RAG)**: 4 hours
- **Phase 2.5 (Auth)**: 3.5 hours
- **Phase 2.6 (Translation)**: 3.5 hours
- **Phase 2.7 (Deployment)**: 1.5 hours
- **Phase 2.8 (Testing)**: 3 hours
- **Phase 2.9 (Docs)**: 1.5 hours
- **Phase 2.10 (Integration)**: 1.5 hours
- **Total**: ~27 hours of development time (can be reduced to ~15 hours with parallelization)

### Critical Path:
1. Task 001 (Init Docusaurus) → Tasks 100-109 (Content) → Task 305 (Embed) → Task 500 (Translate) → Task 604 (Deploy)
2. Task 002 (Init FastAPI) → Tasks 300-304 (RAG) → Task 401 (Auth) → Task 601 (Deploy Backend)

### Next Command:
```bash
/sp.tasks
```
This will generate `tasks.md` with detailed, dependency-ordered tasks for `/sp.implement` execution.

## Notes

- **Constitution Compliance**: All tasks align with 8 core principles
- **PDF Fidelity**: Content derived from 9 pages of curriculum PDF
- **Bonus Points**: 7 subagents + ~15 skills = 50 bonus points, Better-Auth signup = 50 points, Personalization buttons = 50 points, Urdu translation = 50 points (Total: 200 bonus points possible)
- **Claude Code**: All agents and skills will be defined in `.claude/` directory for reusability
- **Testing**: TDD workflow enforced (tests before implementation)
- **Deployment**: Free tier (GitHub Pages + Railway + Neon + Qdrant)

---

**Status**: Phase 1 COMPLETE ✅ | Ready for `/sp.tasks` command
