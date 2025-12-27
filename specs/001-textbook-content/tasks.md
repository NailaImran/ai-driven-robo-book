# Tasks: Physical AI & Humanoid Robotics Interactive Textbook

**Input**: Design documents from `/specs/001-textbook-content/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rag-api.yaml

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per workflow requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (monorepo)**: `website/` (Docusaurus frontend), `backend/` (FastAPI backend)
- All paths are relative to repository root: `/mnt/e/learn-robotics/learn-humanoid-robotics/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure with website/ and backend/ folders per plan.md:117-304
- [x] T002 [P] Initialize Docusaurus project with v3.x in website/package.json
- [x] T003 [P] Initialize FastAPI backend with requirements.txt in backend/requirements.txt
- [x] T004 [P] Create .env.example files in website/.env.example and backend/.env.example
- [x] T005 [P] Setup TypeScript configuration in website/tsconfig.json
- [x] T006 [P] Configure linting and formatting tools (ESLint, Prettier, Black) in website/.eslintrc and backend/.flake8
- [x] T007 Create README.md with project overview and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Setup Alembic database migrations framework in backend/alembic/env.py
- [x] T009 Create initial database schema migration in backend/alembic/versions/001_initial_schema.py (users, user_preferences, chat_history, content_metadata, technical_terms tables from data-model.md:86-148)
- [x] T010 [P] Create Qdrant vector database collection 'humanoid_robotics_textbook' in backend/app/services/rag/vectorstore.py with config from data-model.md:150-169
- [x] T011 [P] Implement FastAPI core configuration in backend/app/core/config.py (environment variables, CORS, database URLs)
- [x] T012 [P] Implement structured logging with correlation IDs in backend/app/core/logging.py
- [x] T013 [P] Create database connection manager in backend/app/core/database.py (Neon Postgres async connection pool)
- [x] T014 Implement Better-Auth authentication framework in backend/app/services/auth/better_auth.py
- [x] T015 Create JWT token middleware in backend/app/services/auth/session.py
- [x] T016 Implement password hashing service with bcrypt (12 rounds) in backend/app/core/security.py
- [x] T017 Create base Pydantic schemas in backend/app/schemas/base.py
- [x] T018 Setup error handling middleware in backend/app/api/dependencies.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 5 - Automated Content Generation (Priority: P1) 🎯 MVP Component

**Goal**: Generate complete 13-week textbook content from PDF curriculum using Claude Code agents. This enables User Story 1 (reading content).

**Independent Test**: Run content generation agents on Week 2 curriculum, verify generated MDX is valid Docusaurus syntax, confirm all sections (learning outcomes, code blocks, diagrams) are present, build passes with `npm run build`.

### Agent Definitions for User Story 5

- [ ] T019 [P] [US5] Create ContentWriterAgent definition in .claude/agents/content-writer.md with input schema (week_number, pdf_section), output schema (mdx_files[]), and skills (generate-mdx, extract-code-blocks, create-mermaid-diagram)
- [ ] T020 [P] [US5] Create DocusaurusLayoutAgent definition in .claude/agents/docusaurus-layout.md with sidebars generation logic
- [ ] T021 [P] [US5] Create generate-mdx skill in .claude/skills/generate-mdx.skill.md for converting curriculum text to MDX format
- [ ] T022 [P] [US5] Create extract-code-blocks skill in .claude/skills/extract-code-blocks.skill.md for Python/ROS2 code extraction
- [ ] T023 [P] [US5] Create create-mermaid-diagram skill in .claude/skills/create-mermaid-diagram.skill.md for architecture diagrams

### Content Generation for User Story 5

- [ ] T024 [P] [US5] Generate Week 1-2 content (Physical AI Intro) using ContentWriterAgent in website/docs/01-physical-ai-intro/ (index.mdx, foundations.mdx, digital-to-physical.mdx, humanoid-landscape.mdx, sensor-systems.mdx)
- [ ] T025 [P] [US5] Generate Week 3-5 content (ROS 2 Fundamentals) in website/docs/02-ros2-fundamentals/ (index.mdx, architecture.mdx, nodes-topics-services.mdx, building-packages.mdx, launch-files.mdx)
- [ ] T026 [P] [US5] Generate Week 6-7 content (Gazebo Simulation) in website/docs/03-gazebo-simulation/ (index.mdx, environment-setup.mdx, urdf-sdf.mdx, physics-simulation.mdx, unity-visualization.mdx)
- [ ] T027 [P] [US5] Generate Week 8-10 content (NVIDIA Isaac) in website/docs/04-nvidia-isaac/ (index.mdx, isaac-sdk.mdx, perception-manipulation.mdx, reinforcement-learning.mdx, sim-to-real.mdx)
- [ ] T028 [P] [US5] Generate Week 11-12 content (Humanoid Development) in website/docs/05-humanoid-development/ (index.mdx, kinematics-dynamics.mdx, bipedal-locomotion.mdx, manipulation-grasping.mdx, human-robot-interaction.mdx)
- [ ] T029 [P] [US5] Generate Week 13 content (Conversational Robotics) in website/docs/06-conversational-robotics/ (index.mdx, gpt-integration.mdx, speech-recognition.mdx, multimodal-interaction.mdx)
- [ ] T030 [P] [US5] Generate Hardware Requirements content in website/docs/07-hardware-requirements/ (index.mdx, digital-twin-workstation.mdx, jetson-kit.mdx, robot-lab-options.mdx, cloud-native-lab.mdx)
- [ ] T031 [P] [US5] Generate Assessments content in website/docs/08-assessments/ (index.mdx, ros2-project.mdx, gazebo-simulation.mdx, isaac-perception-pipeline.mdx)
- [ ] T032 [P] [US5] Generate Capstone Project content in website/docs/09-capstone/ (index.mdx, autonomous-humanoid.mdx, requirements.mdx, evaluation.mdx)
- [ ] T033 [P] [US5] Generate Introduction/Overview content in website/docs/00-introduction/ (index.mdx, course-overview.mdx, learning-outcomes.mdx, why-physical-ai.mdx)
- [ ] T034 [US5] Generate sidebar configuration using DocusaurusLayoutAgent in website/sidebars.js with hierarchical navigation for all 10 chapters
- [ ] T035 [US5] Validate all generated MDX files have valid frontmatter (title, description, sidebar_position) and build without errors

**Checkpoint**: At this point, all textbook content should be generated and ready for User Story 1 (reading)

---

## Phase 4: User Story 1 - Read Structured Curriculum Content (Priority: P1) 🎯 MVP Component

**Goal**: Enable students to read and navigate the complete 13-week textbook curriculum with search, responsive design, and accessibility compliance.

**Independent Test**: Deploy static Docusaurus site, verify all 260+ pages load correctly, test sidebar navigation from Chapter 1 to Capstone, run search for "inverse kinematics" and verify results, check mobile responsiveness at 375px width, run Lighthouse audit (Accessibility >95).

### Implementation for User Story 1

- [ ] T036 [P] [US1] Configure Docusaurus in website/docusaurus.config.js with site metadata, theme, navigation, search plugin (Algolia DocSearch or local search)
- [ ] T037 [P] [US1] Create custom CSS theme in website/src/css/custom.css with brand colors, typography, responsive breakpoints
- [ ] T038 [P] [US1] Create landing page in website/src/pages/index.tsx with course introduction, "Start Learning" CTA, feature highlights
- [ ] T039 [US1] Configure Docusaurus search plugin (Algolia DocSearch configuration or local search setup)
- [ ] T040 [US1] Add MDX plugins in docusaurus.config.js for code syntax highlighting (Prism), math equations (KaTeX), Mermaid diagrams
- [ ] T041 [US1] Configure responsive navigation in website/docusaurus.config.js (mobile hamburger menu, tablet/desktop sidebar)
- [ ] T042 [US1] Add copy buttons to code blocks using Docusaurus theme configuration
- [ ] T043 [US1] Test link validation by running `npm run build` and checking for broken internal links
- [ ] T044 [US1] Run Lighthouse accessibility audit and fix any WCAG 2.1 Level AA violations to achieve score >95

**Checkpoint**: At this point, User Story 1 (textbook reading) should be fully functional and independently testable

---

## Phase 5: User Story 2 - Interactive RAG Chatbot Assistance (Priority: P2)

**Goal**: Provide AI-powered Q&A chatbot that retrieves relevant textbook content and generates contextual answers with source citations.

**Independent Test**: Deploy backend RAG service, vectorize sample Week 2 content (5 pages), send test query "What is forward kinematics?" via API, verify response includes answer + source links, test concurrent 50 requests, measure p95 latency <3s.

### Agent Definitions for User Story 2

- [ ] T045 [P] [US2] Create RAGBuilderAgent definition in .claude/agents/rag-builder.md for RAG pipeline implementation
- [ ] T046 [P] [US2] Create chunk-markdown skill in .claude/skills/chunk-markdown.skill.md for semantic chunking (512 tokens + 50 overlap)
- [ ] T047 [P] [US2] Create generate-embeddings skill in .claude/skills/generate-embeddings.skill.md for OpenAI text-embedding-3-small integration

### Backend RAG Implementation for User Story 2

- [ ] T048 [P] [US2] Implement content chunking service in backend/app/services/rag/chunking.py with semantic chunking logic (512 tokens, 50-token overlap, preserve code blocks)
- [ ] T049 [P] [US2] Implement embeddings service in backend/app/services/rag/embeddings.py using OpenAI text-embedding-3-small API
- [ ] T050 [P] [US2] Implement vector store service in backend/app/services/rag/vectorstore.py for Qdrant operations (upsert, search with metadata filtering)
- [ ] T051 [P] [US2] Implement RAG generation service in backend/app/services/rag/generation.py using OpenAI chat completions with retrieved context
- [ ] T052 [US2] Create RAG query endpoint POST /api/rag/query in backend/app/api/routes/rag.py per contracts/rag-api.yaml:14-60
- [ ] T053 [US2] Create selected-text query endpoint POST /api/rag/query-selection in backend/app/api/routes/rag.py per contracts/rag-api.yaml:62-86
- [ ] T054 [US2] Implement query logging to chat_history table in backend/app/services/rag/generation.py
- [ ] T055 [US2] Create Pydantic schemas for RAG requests/responses in backend/app/schemas/rag.py
- [ ] T056 [US2] Run embedding pipeline on all generated MDX content from Phase 3 to populate Qdrant collection

### Frontend Chatbot for User Story 2

- [ ] T057 [P] [US2] Create RAGChatbot React component in website/src/components/RAGChatbot.tsx (floating widget, collapsible, message history, loading states)
- [ ] T058 [US2] Integrate RAGChatbot component into Docusaurus theme Root wrapper in website/src/theme/Root.tsx
- [ ] T059 [US2] Add feedback buttons (thumbs up/down) to chatbot responses in RAGChatbot.tsx
- [ ] T060 [US2] Implement "Ask about selected text" feature in RAGChatbot.tsx using window.getSelection() API

**Checkpoint**: At this point, User Story 2 (chatbot) should work independently alongside User Story 1

---

## Phase 6: User Story 6 - GitHub Pages Deployment (Priority: P2)

**Goal**: Automate build and deployment of textbook to GitHub Pages on every commit to main branch, with quality gates.

**Independent Test**: Create test commit to main branch, verify GitHub Actions workflow triggers, check build logs for lint/type-check/build steps, confirm deployment to `https://<username>.github.io/learn-humanoid-robotics/` completes within 5 minutes, verify site loads correctly.

### Agent Definitions for User Story 6

- [ ] T061 [P] [US6] Create GitHubDeploymentAgent definition in .claude/agents/github-deployment.md for CI/CD workflow generation

### Implementation for User Story 6

- [ ] T062 [P] [US6] Create frontend deployment workflow in .github/workflows/deploy-frontend.yml (trigger on push to main, steps: npm install, lint, type-check, build, deploy to gh-pages branch)
- [ ] T063 [P] [US6] Create backend deployment workflow in .github/workflows/deploy-backend.yml (trigger on push to main, Railway auto-deploy configuration)
- [ ] T064 [P] [US6] Create test workflow in .github/workflows/run-tests.yml (run on PRs, backend pytest, frontend link validation)
- [ ] T065 [US6] Add link validation step to frontend workflow using Docusaurus built-in validator
- [ ] T066 [US6] Configure GitHub Pages settings (source: gh-pages branch, custom domain if applicable)
- [ ] T067 [US6] Add Lighthouse CI step to frontend workflow for performance/accessibility audits (fail if Performance <90 or Accessibility <95)
- [ ] T068 [US6] Create deployment documentation in specs/001-textbook-content/quickstart.md deployment section

**Checkpoint**: At this point, automated deployment should work for User Stories 1, 2, and 5

---

## Phase 7: User Story 3 - Personalized Learning Experience (Priority: P3)

**Goal**: Adapt textbook content presentation based on user persona (Student/Educator/Self-Learner/Professional) and skill level (Beginner/Intermediate/Advanced).

**Independent Test**: Create test accounts with different personas (Student-Beginner, Professional-Advanced), set preferences, navigate to Week 4 content, verify different content variants render (beginner shows more explanations, advanced shows condensed content), test preference sync by logging out/in on different device.

### Agent Definitions for User Story 3

- [ ] T069 [P] [US3] Create PersonalizationEngineAgent definition in .claude/agents/personalization-engine.md for adaptive content system
- [ ] T070 [P] [US3] Create generate-content-variants skill in .claude/skills/generate-content-variants.skill.md for creating beginner/intermediate/advanced content sections

### Backend Personalization for User Story 3

- [ ] T071 [P] [US3] Create User model in backend/app/models/user.py with fields from data-model.md:8-16
- [ ] T072 [P] [US3] Create UserPreference model in backend/app/models/personalization.py with fields from data-model.md:20-32
- [ ] T073 [P] [US3] Implement signup endpoint POST /api/auth/signup in backend/app/api/routes/auth.py with background questions per contracts/rag-api.yaml:88-114
- [ ] T074 [US3] Implement GET /api/personalization/profile endpoint in backend/app/api/routes/personalization.py per contracts/rag-api.yaml:116-127
- [ ] T075 [US3] Implement PUT /api/personalization/profile endpoint in backend/app/api/routes/personalization.py per contracts/rag-api.yaml:128-140
- [ ] T076 [US3] Create Pydantic schemas for auth/personalization in backend/app/schemas/auth.py and backend/app/schemas/personalization.py

### Frontend Personalization for User Story 3

- [ ] T077 [P] [US3] Create PersonalizationContext in website/src/context/PersonalizationContext.tsx (manages persona, skill level, learning pace state)
- [ ] T078 [P] [US3] Create usePersonalization hook in website/src/hooks/usePersonalization.ts for accessing context
- [ ] T079 [P] [US3] Create PersonalizationButton component in website/src/components/PersonalizationButton.tsx (modal with persona/skill/pace selectors)
- [ ] T080 [P] [US3] Create AuthWidget component in website/src/components/AuthWidget.tsx (signup/signin UI, Better-Auth integration)
- [ ] T081 [US3] Integrate PersonalizationContext provider into Root theme wrapper in website/src/theme/Root.tsx
- [ ] T082 [US3] Add PersonalizationButton to Docusaurus navbar in website/docusaurus.config.js
- [ ] T083 [US3] Implement localStorage sync for unauthenticated users in PersonalizationContext.tsx (key: 'robotics_textbook_user_prefs')
- [ ] T084 [US3] Implement backend preference sync on login in AuthWidget.tsx
- [ ] T085 [US3] Add conditional content rendering to sample pages (e.g., Week 2 kinematics) using usePersonalization hook to show/hide beginner vs advanced sections

**Checkpoint**: At this point, User Story 3 (personalization) should work independently alongside previous stories

---

## Phase 8: User Story 4 - Urdu Language Translation (Priority: P3)

**Goal**: Provide complete Urdu translations for all textbook chapters with right-to-left layout and technical term consistency.

**Independent Test**: Translate sample Week 3 chapter to Urdu, verify Urdu MDX file in website/i18n/ur/docusaurus-plugin-content-docs/current/02-ros2-fundamentals/, check RTL layout renders correctly in Chrome/Firefox/Safari, validate technical terms match glossary, toggle language switcher to confirm <2s transition.

### Agent Definitions for User Story 4

- [ ] T086 [P] [US4] Create UrduTranslatorAgent definition in .claude/agents/urdu-translator.md with translation workflow (preserve code blocks, use glossary, maintain MDX structure)
- [ ] T087 [P] [US4] Create translate-content skill in .claude/skills/translate-content.skill.md for EN→UR translation with glossary lookup
- [ ] T088 [P] [US4] Create update-glossary skill in .claude/skills/update-glossary.skill.md for adding new technical terms

### Implementation for User Story 4

- [ ] T089 [US4] Bootstrap English-Urdu technical glossary in website/i18n/glossary-en-ur.json with 200 core robotics terms (kinematics→حرکیات, SLAM→ہم وقت سازی, etc.)
- [ ] T090 [US4] Configure Docusaurus i18n in website/docusaurus.config.js (locales: ['en', 'ur'], defaultLocale: 'en', direction for 'ur': 'rtl')
- [ ] T091 [P] [US4] Translate Week 1-2 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/01-physical-ai-intro/
- [ ] T092 [P] [US4] Translate Week 3-5 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/02-ros2-fundamentals/
- [ ] T093 [P] [US4] Translate Week 6-7 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/03-gazebo-simulation/
- [ ] T094 [P] [US4] Translate Week 8-10 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/04-nvidia-isaac/
- [ ] T095 [P] [US4] Translate Week 11-12 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/05-humanoid-development/
- [ ] T096 [P] [US4] Translate Week 13 content to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/06-conversational-robotics/
- [ ] T097 [P] [US4] Translate Hardware Requirements to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/07-hardware-requirements/
- [ ] T098 [P] [US4] Translate Assessments to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/08-assessments/
- [ ] T099 [P] [US4] Translate Capstone Project to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/09-capstone/
- [ ] T100 [P] [US4] Translate Introduction to Urdu in website/i18n/ur/docusaurus-plugin-content-docs/current/00-introduction/
- [ ] T101 [US4] Add language switcher to Docusaurus navbar in website/docusaurus.config.js
- [ ] T102 [US4] Test RTL layout rendering for Urdu content (verify code blocks remain LTR, text flows RTL, navigation works correctly)
- [ ] T103 [US4] Update RAG backend to support Urdu queries by adding language parameter to embedding/retrieval logic in backend/app/services/rag/generation.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T104 [P] Update README.md with complete setup instructions, architecture diagram, contribution guidelines
- [ ] T105 [P] Add FastAPI auto-generated API documentation at /docs endpoint using Swagger UI
- [ ] T106 [P] Implement rate limiting on RAG endpoints in backend/app/api/routes/rag.py (100 requests per minute per IP)
- [ ] T107 [P] Add CORS configuration in backend/app/main.py to allow frontend origin
- [ ] T108 [P] Implement request correlation IDs in backend/app/core/logging.py for distributed tracing
- [ ] T109 [P] Add error handling for OpenAI API failures (rate limits, timeouts) in backend/app/services/rag/embeddings.py and generation.py
- [ ] T110 [P] Add loading skeletons to RAGChatbot component for better UX during query processing
- [ ] T111 [P] Optimize Docusaurus build performance by enabling minification and code splitting in website/docusaurus.config.js
- [ ] T112 Run quickstart.md validation (follow all steps in specs/001-textbook-content/quickstart.md and verify setup works)
- [ ] T113 Create user guide documentation in website/docs/00-introduction/how-to-use-this-textbook.mdx
- [ ] T114 Add security headers (Content-Security-Policy, X-Frame-Options) to deployed backend via Railway configuration
- [ ] T115 Perform final integration testing: verify all 6 user stories work together without conflicts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 5 (Phase 3)**: Depends on Foundational - Generates content needed for US1
- **User Story 1 (Phase 4)**: Depends on US5 completion - Needs generated content to display
- **User Story 2 (Phase 5)**: Depends on Foundational + US5 (needs content to vectorize)
- **User Story 6 (Phase 6)**: Depends on US1 (needs site to deploy)
- **User Story 3 (Phase 7)**: Depends on Foundational + US1 (needs basic site + auth)
- **User Story 4 (Phase 8)**: Depends on US5 (needs English content to translate)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 5 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 1 (P1)**: DEPENDS on User Story 5 (needs generated content)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) + US5 (needs content to vectorize) - Independent of US1, but enhances it
- **User Story 6 (P2)**: Depends on US1 (needs functional site to deploy) - Independent of US2/US3/US4
- **User Story 3 (P3)**: Depends on Foundational + US1 (needs auth + basic site) - Independent of US2/US4/US6
- **User Story 4 (P3)**: Depends on US5 (needs English content source) - Independent of US1/US2/US3/US6

### Within Each User Story

- **US5**: Agent definitions can run in parallel (T019-T023), then all content generation tasks can run in parallel (T024-T033), then sidebar + validation sequential (T034-T035)
- **US1**: Most tasks can run in parallel (T036-T038), search config sequential after those (T039), then remaining config tasks (T040-T042), finally validation tasks sequential (T043-T044)
- **US2**: Agent definitions parallel (T045-T047), backend services parallel (T048-T051), then endpoints (T052-T053), logging (T054), schemas (T055), embedding pipeline (T056), frontend tasks parallel (T057-T060)
- **US6**: Agent definition (T061), then all workflows can be created in parallel (T062-T064), config tasks (T065-T067), docs (T068)
- **US3**: Agent definitions parallel (T069-T070), backend models parallel (T071-T072), endpoints sequential (T073-T075), schemas (T076), frontend tasks mostly parallel (T077-T080), integration sequential (T081-T085)
- **US4**: Agent definitions parallel (T086-T088), glossary bootstrap (T089), i18n config (T090), all translations parallel (T091-T100), switcher/testing/backend update sequential (T101-T103)

### Parallel Opportunities

**Setup Phase**: T002, T003, T004, T005, T006 can all run in parallel

**Foundational Phase**: T010, T011, T012, T013 can run in parallel

**US5 Agent Definitions**: T019, T020, T021, T022, T023 can run in parallel

**US5 Content Generation**: T024, T025, T026, T027, T028, T029, T030, T031, T032, T033 can ALL run in parallel (10 parallel tasks) - biggest parallelization opportunity

**US1 Setup**: T036, T037, T038 can run in parallel

**US2 Agent Definitions**: T045, T046, T047 can run in parallel

**US2 Backend Services**: T048, T049, T050, T051 can run in parallel

**US2 Frontend**: T057 can start once T056 completes

**US6 Workflows**: T062, T063, T064 can run in parallel

**US3 Agent Definitions**: T069, T070 can run in parallel

**US3 Backend Models**: T071, T072 can run in parallel

**US3 Frontend Components**: T077, T078, T079, T080 can run in parallel

**US4 Agent Definitions**: T086, T087, T088 can run in parallel

**US4 Translations**: T091, T092, T093, T094, T095, T096, T097, T098, T099, T100 can ALL run in parallel (10 parallel tasks)

**Polish Phase**: T104, T105, T106, T107, T108, T109, T110, T111 can run in parallel

---

## Parallel Example: User Story 5 (Content Generation)

```bash
# Launch all agent definitions together:
Task T019: "Create ContentWriterAgent definition in .claude/agents/content-writer.md"
Task T020: "Create DocusaurusLayoutAgent definition in .claude/agents/docusaurus-layout.md"
Task T021: "Create generate-mdx skill in .claude/skills/generate-mdx.skill.md"
Task T022: "Create extract-code-blocks skill in .claude/skills/extract-code-blocks.skill.md"
Task T023: "Create create-mermaid-diagram skill in .claude/skills/create-mermaid-diagram.skill.md"

# Then launch all content generation together (10 parallel tasks):
Task T024: "Generate Week 1-2 content in website/docs/01-physical-ai-intro/"
Task T025: "Generate Week 3-5 content in website/docs/02-ros2-fundamentals/"
Task T026: "Generate Week 6-7 content in website/docs/03-gazebo-simulation/"
Task T027: "Generate Week 8-10 content in website/docs/04-nvidia-isaac/"
Task T028: "Generate Week 11-12 content in website/docs/05-humanoid-development/"
Task T029: "Generate Week 13 content in website/docs/06-conversational-robotics/"
Task T030: "Generate Hardware Requirements in website/docs/07-hardware-requirements/"
Task T031: "Generate Assessments in website/docs/08-assessments/"
Task T032: "Generate Capstone Project in website/docs/09-capstone/"
Task T033: "Generate Introduction in website/docs/00-introduction/"
```

---

## Implementation Strategy

### MVP First (User Stories 5 + 1 Only)

This is the minimum viable product that delivers a functional textbook:

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T018) - CRITICAL blocking phase
3. Complete Phase 3: User Story 5 (T019-T035) - Generate all content
4. Complete Phase 4: User Story 1 (T036-T044) - Enable reading experience
5. **STOP and VALIDATE**: Test textbook reading experience independently
6. Deploy to GitHub Pages and share for feedback

**MVP Result**: Students can read complete 13-week textbook curriculum with search and navigation

### Incremental Delivery

Add value incrementally after MVP:

1. **MVP**: Setup + Foundational + US5 + US1 → Readable textbook (P1 features complete)
2. **v1.1**: + User Story 2 → Add AI chatbot assistance (P2 feature)
3. **v1.2**: + User Story 6 → Add automated deployment (P2 feature)
4. **v1.3**: + User Story 3 → Add personalization (P3 feature)
5. **v1.4**: + User Story 4 → Add Urdu translation (P3 feature)
6. **v2.0**: + Phase 9 Polish → Production-ready release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T018)
2. Once Foundational is done:
   - **Developer A**: User Story 5 (content generation) → T019-T035
   - **Developer B**: User Story 2 (chatbot) → T045-T060 (can start T048-T051 backend while A generates content)
   - **Developer C**: User Story 6 (deployment) → T061-T068 (can start once A completes T036-T044)
3. After P1+P2 features:
   - **Developer A**: User Story 3 (personalization) → T069-T085
   - **Developer B**: User Story 4 (Urdu translation) → T086-T103
4. **Everyone**: Phase 9 Polish → T104-T115

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability (US1-US6)
- Each user story should be independently completable and testable
- Total tasks: 115 (7 setup + 11 foundational + 17 US5 + 9 US1 + 16 US2 + 8 US6 + 17 US3 + 18 US4 + 12 polish)
- Biggest parallelization opportunities: US5 content generation (10 parallel), US4 translations (10 parallel)
- Critical path: Setup → Foundational → US5 → US1 → Deploy
- Estimated timeline:
  - Sequential: ~40 hours
  - With parallelization: ~18 hours (content generation and translations in parallel)
  - MVP only (US5 + US1): ~8 hours with parallelization
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are NOT included per specification (not explicitly requested)
