# Research: Physical AI & Humanoid Robotics Textbook

**Feature**: 001-textbook-content
**Date**: 2025-12-12
**Purpose**: Resolve technical unknowns and establish technology decisions for implementation

## Executive Summary

This research document consolidates decisions for building a Docusaurus-based Physical AI & Humanoid Robotics textbook with RAG chatbot, personalization, Urdu translation, and automated deployment. All decisions align with the Constitution's 8 core principles and the source PDF curriculum.

## 1. Content Organization Strategy

### Decision: 13-Week Module-Based Structure
**Rationale**: The PDF defines a clear 13-week course structure (Weeks 1-13) organized into 4 modules. This maps naturally to Docusaurus's hierarchical navigation.

**Structure**:
```
website/docs/
├── 00-introduction/          # Course overview, learning outcomes
├── 01-physical-ai-intro/     # Weeks 1-2
├── 02-ros2-fundamentals/     # Weeks 3-5
├── 03-gazebo-simulation/     # Weeks 6-7
├── 04-nvidia-isaac/          # Weeks 8-10
├── 05-humanoid-development/  # Weeks 11-12
├── 06-conversational-robotics/ # Week 13
├── 07-hardware-requirements/ # Equipment specs
├── 08-assessments/           # Projects and evaluations
└── 09-capstone/              # Final autonomous humanoid project
```

**Alternatives Considered**:
- Single flat structure: Rejected due to poor navigation UX
- Topic-based clustering: Rejected because weekly progression is pedagogically important

### Decision: MDX for Interactive Content
**Rationale**: MDX allows embedding React components (personalization buttons, code sandboxes, Mermaid diagrams) directly in markdown.

**Implementation**: Each page includes:
- Frontmatter (title, description, learning outcomes)
- MDX body with embedded PersonalizationButton, UrduTranslateButton
- Code blocks with syntax highlighting (Python, ROS2 XML)
- Mermaid diagrams for robot architectures

## 2. RAG Chatbot Architecture

### Decision: Semantic Chunking with Hierarchical Retrieval
**Rationale**: Robotics content includes long code examples and technical explanations that benefit from context-aware chunking.

**Strategy**:
1. **Chunking**: 512 tokens per chunk with 50-token overlap
2. **Metadata enrichment**: Store `{chapter_id, week_number, module_name, section_title, page_url}` with each chunk
3. **Hierarchical search**: Query embeds → Retrieve top-K chunks → Re-rank by chapter/module relevance

**Alternatives Considered**:
- Fixed-size chunking (e.g., 500 words): Rejected because it splits code blocks and equations mid-content
- Paragraph-level chunking: Rejected because robotics paragraphs vary wildly in length (50-1000 words)

### Decision: OpenAI text-embedding-3-small for Embeddings
**Rationale**: Cost-effective (1536 dimensions) with strong performance on technical content. Qdrant Free Tier supports up to 1M vectors.

**Cost Analysis**:
- Estimated chunks: ~800 (13 weeks × ~60 chunks/week)
- Embedding cost: $0.02 per 1M tokens → ~$0.10 one-time
- Qdrant storage: Free tier (1GB, sufficient for 800 chunks)

### Decision: FastAPI for Backend API
**Rationale**: Async support for concurrent RAG queries, native Pydantic integration for request/response validation, auto-generated OpenAPI docs.

**Endpoints**:
- `POST /api/rag/query` - Main chatbot query
- `POST /api/rag/query-selection` - Answer from selected text only
- `POST /api/rag/embed-content` - Admin endpoint to re-embed after content updates
- `GET /api/rag/health` - Service health check

## 3. Personalization Engine

### Decision: Profile-Based Content Variants with Client-Side Rendering
**Rationale**: Docusaurus is a static site generator. Personalization must happen client-side using React Context.

**User Profiles** (from PDF requirements):
- **Persona**: Student, Educator, Self-Learner, Industry Professional
- **Skill Level**: Beginner, Intermediate, Advanced
- **Learning Pace**: Accelerated, Standard, Extended
- **Software Background**: None, Basic Python, Experienced with ROS
- **Hardware Background**: Simulation-only, Has Jetson Kit, Has Full Robot Lab

**Content Adaptation**:
- **Beginner**: More explanatory text, step-by-step walkthroughs, visual aids
- **Intermediate**: Balanced theory/practice, code examples with annotations
- **Advanced**: Research papers cited, optimization techniques, advanced topics
- **Educator**: Teaching notes, discussion prompts, assignment rubrics
- **Industry Professional**: ROI considerations, real-world case studies, deployment strategies

**Storage**:
- Unauthenticated users: localStorage (`robotics_textbook_user_prefs`)
- Authenticated users: Neon Postgres `user_preferences` table

### Decision: Button-Triggered Personalization (Per-Chapter)
**Rationale**: PDF requirement specifies "pressing a button at the start of each chapter."

**Implementation**:
- Each chapter MDX file includes `<PersonalizationButton />` component at top
- Clicking opens modal with profile questions (persona, skill level, etc.)
- Profile updates trigger React Context re-render
- Content sections conditionally render based on context

## 4. Urdu Translation

### Decision: AI-Assisted Translation with Human-Reviewed Technical Glossary
**Rationale**: Technical robotics terms (kinematics, SLAM, URDF) require consistent translation. AI speeds up translation; glossary ensures accuracy.

**Workflow**:
1. **Glossary bootstrap**: Create initial EN→UR mappings for ~200 core terms (ROS2, Gazebo, Isaac Sim, sensors, actuators)
2. **AI translation**: Claude Code Urdu Translator Agent translates MDX pages
3. **Preservation**: Code blocks, equations, component names remain in English
4. **RTL layout**: Docusaurus i18n with `direction: 'rtl'` for Urdu locale

**Technical Glossary Examples**:
- Kinematics → حرکیات (Harki'at)
- Inverse Kinematics → معکوس حرکیات (Ma'koos Harki'at)
- SLAM → ہم وقت سازی مقام اور نقشہ سازی (Synchronous Location and Mapping - abbreviated)
- Humanoid Robot → انسان نما روبوٹ (Insaan-numa Robot)

**Alternatives Considered**:
- Full human translation: Rejected due to cost and time (13 weeks × 20 pages = 260+ pages)
- Google Translate API: Rejected due to poor handling of technical terms

## 5. Better-Auth Integration

### Decision: Better-Auth with Credentials Provider + OAuth (Google) for Signup/Signin
**Rationale**: Better-Auth is lightweight, TypeScript-native, and supports multiple providers. PDF requires asking background questions at signup.

**Signup Flow**:
1. User provides email + password
2. **Custom questions** (per PDF requirements):
   - Software background: None, Basic Python, Experienced with ROS, Professional Developer
   - Hardware background: Simulation-only, Have Jetson Kit, Have Robot Lab, No Hardware Yet
   - Learning goal: Academic Course, Self-Study, Professional Upskilling
3. Responses stored in `user_preferences` table
4. Initial persona/skill level inferred from answers (e.g., "No software background" → Beginner)

**Session Management**:
- JWT tokens (7-day expiration)
- HttpOnly cookies for web security
- Token refresh on page load if <1 day remaining

**Database Schema** (Neon Postgres):
- `users` table: id, email, password_hash, full_name, created_at
- `user_preferences` table: user_id, persona, skill_level, learning_pace, language, software_bg, hardware_bg, learning_goal

## 6. Deployment Strategy

### Decision: GitHub Pages for Frontend + Railway for Backend
**Rationale**: GitHub Pages is free, has automatic SSL, and integrates natively with GitHub Actions. Railway Free Tier supports FastAPI + Postgres.

**CI/CD Pipeline**:
1. **Frontend (GitHub Actions)**:
   - Trigger: Push to `main` branch
   - Steps: Install deps → Lint → Type check → Build Docusaurus → Deploy to `gh-pages`
   - Quality gates: Zero broken links, Lighthouse accessibility >95, build time <5min

2. **Backend (Railway)**:
   - Trigger: Push to `main` branch (Railway auto-deploys)
   - Steps: Install Python deps → Run pytest → Deploy FastAPI → Run migrations
   - Health check: `/api/rag/health` must return 200

**Environment Variables** (GitHub Secrets + Railway):
- `OPENAI_API_KEY`
- `NEON_DATABASE_URL`
- `QDRANT_URL`, `QDRANT_API_KEY`
- `BETTER_AUTH_SECRET`

**Alternatives Considered**:
- Vercel for both frontend/backend: Rejected because Vercel's serverless functions have cold start issues for RAG (3-5s latency)
- AWS Amplify: Rejected due to complexity and cost

## 7. Content Generation with Claude Code Agents

### Decision: 7 Specialized Subagents (Per Constitution Principle III)
**Rationale**: Multi-agent orchestration improves output quality and enables parallel execution.

**Agents**:
1. **ContentWriterAgent**: Generates MDX from PDF curriculum
   - Input: Week number, learning outcomes, source PDF section
   - Output: MDX files with code examples, diagrams, assessment questions
   - Skills: `generate-mdx`, `extract-code-blocks`, `create-mermaid-diagram`

2. **DocusaurusLayoutAgent**: Configures site structure
   - Input: Chapter list, sidebar organization
   - Output: `docusaurus.config.js`, `sidebars.js`, theme customizations
   - Skills: `generate-sidebar`, `validate-docusaurus-config`

3. **RAGBuilderAgent**: Implements RAG pipeline
   - Input: Docusaurus docs directory
   - Output: FastAPI endpoints, Qdrant collection, embedding scripts
   - Skills: `chunk-markdown`, `generate-embeddings`, `setup-qdrant`

4. **BetterAuthIntegratorAgent**: Implements authentication
   - Input: User schema, signup questions
   - Output: Auth endpoints, database migrations, React auth components
   - Skills: `generate-auth-endpoints`, `setup-better-auth`, `create-migrations`

5. **UrduTranslatorAgent**: Translates to Urdu
   - Input: English MDX files, technical glossary
   - Output: Urdu MDX in `i18n/ur/` directory
   - Skills: `translate-content`, `preserve-mdx-structure`, `update-glossary`

6. **PersonalizationEngineAgent**: Builds adaptive content system
   - Input: User profile schema, content variants
   - Output: React Context, personalization components, backend preference endpoints
   - Skills: `generate-content-variants`, `route-by-persona`, `create-react-context`

7. **GitHubDeploymentAgent**: Sets up CI/CD
   - Input: Repository details, deployment config
   - Output: GitHub Actions workflows, deployment scripts
   - Skills: `generate-gh-workflow`, `validate-yaml`, `create-deployment-docs`

## 8. Hardware Requirements Documentation

### Decision: Information-Only with Budget-Conscious Recommendations
**Rationale**: PDF specifies extensive hardware (RTX 4070 Ti, Jetson Orin, RealSense cameras, robots). Textbook provides guidance but doesn't sell hardware.

**Content Strategy**:
- **Chapter 7 (Hardware Requirements)**: Detailed specs from PDF
  - Digital Twin Workstation (RTX GPU, 64GB RAM, Ubuntu 22.04)
  - Jetson Kit ($700 economy kit breakdown)
  - Robot Lab options (Unitree Go2, G1 humanoid)
  - Cloud-native alternatives (AWS g5.2xlarge)

- **Emphasis**: Simulation-first approach (students can complete course with cloud instances + Jetson kit, no physical robot required)

## 9. Testing & Validation Strategy

### Decision: Multi-Layer Testing (Per Constitution Principle V - TDD)
**Rationale**: Educational content + complex backend requires thorough testing.

**Testing Layers**:
1. **Content Validation**:
   - Broken link checking (Docusaurus plugin)
   - MDX syntax validation
   - Code block syntax highlighting verification
   - Image asset existence checks

2. **Backend Unit Tests** (pytest):
   - RAG chunking logic
   - Embedding generation
   - Query retrieval accuracy (test with known question-answer pairs)
   - Auth flows (signup, login, token refresh)

3. **Integration Tests**:
   - End-to-end RAG pipeline (query → retrieve → generate → respond)
   - Personalization preference persistence (localStorage ↔ database sync)
   - Urdu translation accuracy (sample technical terms)

4. **Performance Tests**:
   - Lighthouse audits (Performance >90, Accessibility >95, SEO >95)
   - Backend API latency (<200ms p95 for RAG queries)
   - Concurrent user load testing (100 simultaneous chatbot queries)

5. **Accessibility Tests**:
   - Screen reader compatibility (NVDA/JAWS on key pages)
   - Keyboard navigation (no mouse required)
   - Color contrast ratios (WCAG 2.1 Level AA)

## 10. Diagram & Visual Asset Strategy

### Decision: Mermaid for Diagrams + Sourced Images for Hardware
**Rationale**: Mermaid generates diagrams from code (version-controllable, theme-aware). Hardware images from manufacturer documentation.

**Diagram Types**:
- **Architecture diagrams**: ROS2 node graphs, Isaac Sim pipeline, RAG flow
- **Flowcharts**: Bipedal locomotion algorithm, SLAM process
- **Sequence diagrams**: Voice-to-action VLA workflow
- **Entity-relationship diagrams**: Database schemas

**Sourcing**:
- Hardware photos: NVIDIA Jetson official site, Intel RealSense, Unitree robotics
- Robot diagrams: URDF visualizations, Gazebo screenshots
- Simulation screenshots: Isaac Sim, Gazebo environments (captured during content creation)

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Content Structure** | 13-week module-based with MDX | Aligns with PDF curriculum, supports interactive components |
| **RAG Architecture** | Semantic chunking + OpenAI embeddings + Qdrant | Cost-effective, handles technical content well |
| **Personalization** | Client-side with React Context | Static site requirement, user privacy (localStorage option) |
| **Translation** | AI-assisted with technical glossary | Speed + accuracy balance for 260+ pages |
| **Authentication** | Better-Auth with custom signup questions | Lightweight, supports background profiling per PDF |
| **Deployment** | GitHub Pages (frontend) + Railway (backend) | Free tier, easy integration, reliable |
| **Agents** | 7 specialized subagents | Constitution Principle III: Multi-Agent Orchestration |
| **Testing** | Multi-layer (content, unit, integration, perf, a11y) | Constitution Principle V: TDD (NON-NEGOTIABLE) |

## Next Steps

This research resolves all technical unknowns. Proceed to:
1. **Phase 1 Design**: Create data-model.md, API contracts, quickstart.md
2. **Phase 2 Implementation**: Generate tasks.md with dependency-ordered tasks
3. **Execution**: Deploy agents to build the textbook

**Constitution Compliance**: All decisions align with 8 core principles (Content Fidelity, Modularity, Multi-Agent Orchestration, Accessibility & i18n, TDD, Observability, Version Control, Security).
