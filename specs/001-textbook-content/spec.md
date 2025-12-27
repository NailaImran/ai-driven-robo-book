# Feature Specification: Physical AI & Humanoid Robotics Interactive Textbook

**Feature Branch**: `001-textbook-content`
**Created**: 2025-12-12
**Status**: Draft
**Input**: User description: "Create complete Physical AI & Humanoid Robotics textbook with Docusaurus, including all chapters, RAG chatbot, personalization, Urdu translation, and deployment"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read Structured Curriculum Content (Priority: P1)

A first-year computer science student visits the textbook website to learn about Physical AI and humanoid robotics. They navigate through the 13-week course curriculum, reading chapters on fundamentals, kinematics, control theory, and simulation. Each chapter presents learning outcomes, explanatory text, code examples, diagrams, and self-assessment questions. The student can bookmark pages, navigate between chapters using sidebar navigation, and use built-in search to find specific topics.

**Why this priority**: Core textbook content is the foundation of the entire project. Without readable, well-structured content, all other features (chatbot, personalization, translation) have no value.

**Independent Test**: Can be fully tested by deploying static Docusaurus site with complete chapter content and verifying all pages load correctly, navigation works, and content matches curriculum learning objectives.

**Acceptance Scenarios**:

1. **Given** a student visits the textbook homepage, **When** they click "Start Learning" or navigate to Chapter 1, **Then** they see the Quarter Overview with introduction, learning outcomes, and course structure
2. **Given** a student is reading Week 3 content on dynamics, **When** they click "Next" or use sidebar navigation, **Then** they move to Week 4 content on control theory with all diagrams and code examples properly rendered
3. **Given** a student searches for "inverse kinematics", **When** the search results display, **Then** they see relevant pages from Week 2 with highlighted snippets
4. **Given** a student accesses the textbook on mobile device, **When** they view any chapter, **Then** content is responsive and readable without horizontal scrolling
5. **Given** a student views a chapter with code examples, **When** the page loads, **Then** syntax highlighting is applied and code blocks have copy buttons

---

### User Story 2 - Interactive RAG Chatbot Assistance (Priority: P2)

A student studying Week 5 (sensors) encounters confusion about IMU calibration. They click the chatbot widget in the bottom-right corner, type "How do I calibrate an IMU sensor?", and receive an AI-generated answer citing specific textbook sections. The chatbot retrieves relevant content chunks from the vector database, generates a contextual response using OpenAI, and provides clickable links to source pages. The student can ask follow-up questions, toggle between English and Urdu responses, and filter answers to specific chapters.

**Why this priority**: Chatbot enhances learning by providing instant Q&A support, but requires core textbook content (P1) to be deployed first for vectorization.

**Independent Test**: Can be tested by deploying backend RAG service, vectorizing sample chapter content, and verifying chatbot responds accurately to test queries with correct source citations.

**Acceptance Scenarios**:

1. **Given** a student opens the chatbot widget, **When** they ask "What is forward kinematics?", **Then** the chatbot retrieves Week 2 content, generates an answer explaining FK with equations, and provides a link to the relevant textbook section
2. **Given** a student asks a question in Urdu, **When** the chatbot processes the query, **Then** it returns an Urdu-language response with proper RTL text rendering
3. **Given** a student highlights text "PID controller gains" on a page, **When** they click "Ask about selected text" in the chatbot, **Then** the chatbot answers using only the highlighted section as context (not entire corpus)
4. **Given** multiple students query the chatbot simultaneously, **When** backend receives 50 concurrent requests, **Then** all responses are generated within 3 seconds and no user data leaks across sessions
5. **Given** a student provides thumbs-up/down feedback on a chatbot response, **When** feedback is submitted, **Then** it is logged to the database for quality improvement tracking

---

### User Story 3 - Personalized Learning Experience (Priority: P3)

An industry professional (different from beginner student) visits the textbook to quickly learn robotics concepts for a project. They click the personalization button, select persona "Industry Professional" and skill level "Advanced". The textbook content adapts to show advanced topics, real-world case studies, and ROI considerations while hiding beginner explanations. When they revisit the site later (logged in via Better-Auth), their preferences persist and content remains personalized.

**Why this priority**: Personalization improves learner engagement and retention, but depends on core content (P1) and authentication infrastructure. It's a value-add, not a core requirement.

**Independent Test**: Can be tested by creating test user accounts with different personas, setting preferences, and verifying content variants render correctly based on user profile.

**Acceptance Scenarios**:

1. **Given** a user clicks the personalization button, **When** they select persona "Student" and skill level "Beginner", **Then** textbook pages show foundational explanations, step-by-step walkthroughs, and visual aids
2. **Given** a user selects persona "Educator", **When** they view Week 4 content, **Then** additional teaching notes, discussion prompts, and assignment ideas appear alongside standard content
3. **Given** a logged-in user sets preferences to "Advanced" skill level, **When** they log out and back in from a different device, **Then** their personalization settings are restored from the backend database
4. **Given** a user changes learning pace from "Standard" to "Accelerated", **When** the page re-renders, **Then** condensed content appears with faster progression between topics
5. **Given** an unauthenticated user sets preferences, **When** they close and reopen the browser, **Then** preferences are restored from localStorage (even without login)

---

### User Story 4 - Urdu Language Translation (Priority: P3)

A Pakistani student whose first language is Urdu visits the textbook. They click the globe icon in the navigation bar and select "اردو". The entire textbook interface and content switches to Urdu with right-to-left (RTL) text layout. Technical terms like "kinematics" and "inverse dynamics" use the standardized Urdu glossary. Code blocks and mathematical equations remain in their original form. The student can toggle back to English at any time.

**Why this priority**: Urdu translation expands accessibility to Urdu-speaking learners, aligning with inclusivity goals, but requires completed English content (P1) as source material.

**Independent Test**: Can be tested by translating sample chapters, verifying Urdu MDX syntax validity, and confirming RTL layout renders correctly in all browsers.

**Acceptance Scenarios**:

1. **Given** a user selects Urdu language, **When** they navigate to Week 1 content, **Then** all explanatory text appears in Urdu with RTL layout while code blocks remain left-to-right
2. **Given** a user views a translated chapter, **When** they encounter the term "forward kinematics", **Then** it displays as the standardized Urdu term from the EN→UR glossary
3. **Given** a user views Urdu content, **When** they click a link to an external resource, **Then** the link functionality works correctly despite RTL layout
4. **Given** a developer updates English chapter content, **When** translation agent processes the update, **Then** Urdu translation is regenerated with updated content while preserving MDX structure
5. **Given** a user toggles between English and Urdu, **When** they switch languages, **Then** the page reloads with the new language in under 2 seconds

---

### User Story 5 - Automated Content Generation (Priority: P1)

A project maintainer (developer using Claude Code) runs the content generation workflow. Claude Code subagents read the curriculum PDF, generate MDX files for all 13 weeks plus assessment chapters, create diagrams using Mermaid syntax, embed code examples, and structure content according to the Docusaurus sidebar configuration. The maintainer reviews generated content for accuracy, makes minor edits, and commits changes to the repository.

**Why this priority**: Automated generation accelerates textbook creation and ensures consistency. This is P1 because manual content writing for 13+ weeks would be prohibitively time-consuming.

**Independent Test**: Can be tested by running content generation agents on a single sample week, verifying generated MDX is valid, and confirming all required sections (learning outcomes, code blocks, diagrams) are present.

**Acceptance Scenarios**:

1. **Given** a maintainer provides Week 2 curriculum outline, **When** Content Writer Agent executes, **Then** it generates `week-02-kinematics.mdx` with introduction, theory, equations, ROS2 code examples, and assessment questions
2. **Given** generated MDX content includes internal links, **When** link validation runs, **Then** all links point to existing pages and no 404 errors occur
3. **Given** a maintainer edits generated content to fix a technical error, **When** they re-run the agent, **Then** the agent preserves manual edits while updating other sections
4. **Given** all week content is generated, **When** Docusaurus builds the site, **Then** no syntax errors occur and all pages render with correct sidebar navigation
5. **Given** a diagram is needed for explaining robot kinematics, **When** Content Writer Agent generates the page, **Then** it includes Mermaid diagram syntax that renders correctly in Docusaurus

---

### User Story 6 - GitHub Pages Deployment (Priority: P2)

A maintainer commits finalized textbook content to the `main` branch. GitHub Actions automatically triggers a build workflow that installs dependencies, runs linting and tests, builds the Docusaurus static site, and deploys it to GitHub Pages. Within 5 minutes, the updated textbook is live at the public URL. The maintainer verifies the deployment by checking the live site and reviewing the GitHub Actions logs.

**Why this priority**: Automated deployment is critical for maintaining the live textbook, but depends on having completed content (P1) to deploy.

**Independent Test**: Can be tested by creating a test deployment to a staging GitHub Pages site, triggering the workflow manually, and verifying successful deployment.

**Acceptance Scenarios**:

1. **Given** a maintainer pushes commits to `main` branch, **When** GitHub Actions workflow triggers, **Then** the site builds successfully and deploys to `https://<username>.github.io/learn-humanoid-robotics/` within 5 minutes
2. **Given** the build process encounters a broken link, **When** link validation fails, **Then** the workflow fails with clear error messages indicating which links are broken
3. **Given** the deployment completes, **When** a user visits the live site, **Then** all assets (images, CSS, JS) load correctly and Lighthouse scores meet thresholds (Performance >90, Accessibility >95)
4. **Given** a maintainer triggers manual deployment via GitHub UI, **When** the workflow runs, **Then** it deploys the latest `main` branch content regardless of recent commits
5. **Given** a deployment fails mid-process, **When** the maintainer reviews logs, **Then** detailed error messages pinpoint the failure step (install, lint, build, deploy)

---

### Edge Cases

- **What happens when a student queries the chatbot about content not in the textbook?** The chatbot responds: "I don't have enough information in the textbook to answer that question. Please refer to external resources or ask your instructor."
- **How does the system handle a student selecting personalization preferences without logging in?** Preferences are stored in localStorage only and persist on that device/browser. A warning message suggests creating an account to sync preferences across devices.
- **What happens when Urdu translation for a new chapter is not yet available?** The page displays a fallback message in Urdu: "ترجمہ دستیاب نہیں ہے۔ براہ کرم انگریزی ورژن دیکھیں" (Translation not available. Please view English version) with a link to the English page.
- **How does the chatbot handle ambiguous queries like "explain robots"?** The chatbot uses semantic search to retrieve the most relevant general content (likely Chapter 1 intro) and includes a clarifying question: "Did you mean humanoid robots specifically, or robot fundamentals?"
- **What happens when a student's browser does not support JavaScript?** The static Docusaurus content remains accessible as HTML, but interactive features (chatbot, personalization, dynamic content switching) are disabled with a non-intrusive message.
- **How does the system handle very long chatbot conversations (50+ messages)?** After 20 messages, the chatbot suggests: "This conversation is getting long. Would you like to start a new topic?" and provides a "Clear chat" button to reset context.
- **What happens when the backend RAG service is down?** The chatbot widget displays: "Assistant temporarily unavailable. Please try again later" and provides a link to contact support or browse the textbook directly.
- **How does deployment handle merge conflicts in `main` branch?** GitHub Actions workflow fails with a clear error message requiring manual conflict resolution before re-running deployment.

## Requirements *(mandatory)*

### Functional Requirements

**Content & Structure**
- **FR-001**: System MUST provide a complete 13-week curriculum covering: fundamentals, kinematics, dynamics, control theory, sensors, actuators, perception, planning, grasping, locomotion, simulation, integration, and capstone project
- **FR-002**: Each weekly chapter MUST include: learning outcomes, explanatory content, code examples (Python/ROS2), diagrams, and self-assessment questions
- **FR-003**: System MUST include six major chapters: Quarter Overview, 13-Week Course Breakdown, Hardware Requirements, Software Architecture, Capstone Project, and Assessments
- **FR-004**: System MUST organize content in a hierarchical structure with chapters, sections, and pages navigable via sidebar
- **FR-005**: System MUST support full-text search across all textbook content with keyword highlighting

**RAG Chatbot**
- **FR-006**: System MUST provide an AI chatbot widget accessible from all pages
- **FR-007**: Chatbot MUST retrieve relevant content chunks using semantic search (vector embeddings) from the textbook corpus
- **FR-008**: Chatbot MUST generate responses using retrieved context and cite source pages with clickable links
- **FR-009**: Chatbot MUST support "answer from selected text" mode where users highlight text and ask questions about that specific selection
- **FR-010**: Chatbot MUST support both English and Urdu query/response languages
- **FR-011**: System MUST log all chatbot queries, responses, and user feedback to a database for quality improvement
- **FR-012**: Chatbot MUST handle concurrent users without cross-session data leakage

**Personalization**
- **FR-013**: System MUST allow users to select a learning persona: Student, Educator, Self-Learner, or Industry Professional
- **FR-014**: System MUST allow users to select skill level: Beginner, Intermediate, or Advanced
- **FR-015**: System MUST allow users to select learning pace: Accelerated, Standard, or Extended
- **FR-016**: System MUST adapt content presentation based on selected persona and skill level (show/hide content variants)
- **FR-017**: System MUST persist personalization preferences for authenticated users across devices and sessions
- **FR-018**: System MUST persist personalization preferences for unauthenticated users in browser localStorage

**Authentication**
- **FR-019**: System MUST provide user signup and signin functionality using Better-Auth
- **FR-020**: System MUST securely hash passwords using bcrypt with minimum 12 rounds
- **FR-021**: System MUST issue session tokens (JWT) with appropriate expiration
- **FR-022**: System MUST sync user preferences from localStorage to backend database upon login
- **FR-023**: System MUST encrypt personally identifiable information (PII) at rest in the database

**Urdu Translation**
- **FR-024**: System MUST provide complete Urdu translations for all textbook chapters
- **FR-025**: Urdu translations MUST preserve technical accuracy and use standardized terminology from an English-Urdu glossary
- **FR-026**: Urdu translations MUST preserve MDX structure, code blocks, and mathematical equations in their original form
- **FR-027**: System MUST render Urdu content with right-to-left (RTL) text layout
- **FR-028**: Users MUST be able to toggle between English and Urdu languages from the navigation bar
- **FR-029**: System MUST maintain an English-to-Urdu technical glossary with consistent terminology

**Deployment & Infrastructure**
- **FR-030**: System MUST deploy the frontend Docusaurus site to GitHub Pages
- **FR-031**: System MUST automatically build and deploy on commits to the `main` branch via GitHub Actions
- **FR-032**: System MUST run linting, type checking, and link validation before deployment
- **FR-033**: System MUST deploy the backend FastAPI service to a cloud platform (Railway, Render, or Fly.io)
- **FR-034**: System MUST use Neon Serverless Postgres for relational data (users, preferences, chat history, content metadata)
- **FR-035**: System MUST use Qdrant Free Tier for vector embeddings storage
- **FR-036**: Deployment workflow MUST fail if any quality gate (tests, linting, build) fails

**Content Generation (via Claude Code Agents)**
- **FR-037**: Content Writer Agent MUST generate MDX files from curriculum specifications
- **FR-038**: Content Writer Agent MUST include learning outcomes, explanatory text, code blocks, and diagrams in generated content
- **FR-039**: Docusaurus Layout Agent MUST configure sidebar navigation, theme settings, and i18n locales
- **FR-040**: RAG Builder Agent MUST vectorize all textbook content and populate Qdrant collection
- **FR-041**: Urdu Translator Agent MUST translate English MDX to Urdu while preserving code blocks and technical terms
- **FR-042**: GitHub Deployment Agent MUST generate GitHub Actions workflow files for CI/CD
- **FR-043**: Better-Auth Integration Agent MUST implement authentication endpoints and database migrations
- **FR-044**: Personalization Engine Agent MUST create React components for personalization UI and backend preference management

### Key Entities

- **User**: Represents a learner or educator using the textbook. Attributes include email, password hash, full name, persona (student/educator/self-learner/professional), skill level (beginner/intermediate/advanced), learning pace (accelerated/standard/extended), language preference (en/ur). Users can be authenticated or anonymous (with localStorage-only preferences).

- **Chapter**: Represents a major section of the textbook (e.g., "Quarter Overview", "13-Week Course Breakdown"). Contains multiple pages, has a unique ID, title, description, and order in the sidebar. Chapters define the high-level curriculum structure.

- **Page**: Represents an individual lesson or topic within a chapter (e.g., "Week 2: Kinematics"). Contains MDX content, learning outcomes, code examples, diagrams, and self-assessment questions. Pages have URLs, titles, and belong to exactly one chapter.

- **Content Chunk**: Represents a semantically meaningful segment of textbook content used for RAG retrieval. Contains text excerpt, chapter/page metadata, vector embedding, and unique ID. Chunks are 512 tokens with 50-token overlap.

- **Chat Message**: Represents a user query or chatbot response in a conversation. Contains message text, sender (user/bot), timestamp, associated user ID (if authenticated), retrieved chunks (for bot responses), and feedback score (thumbs up/down).

- **User Preference**: Represents personalization settings for a user. Contains persona, skill level, learning pace, language preference. Linked to User entity via one-to-one relationship. Synced between localStorage (client) and database (server).

- **Technical Term**: Represents an English-Urdu translation pair in the glossary. Contains English term, Urdu translation, context/usage notes. Used by Urdu Translator Agent to ensure terminology consistency.

- **Content Metadata**: Tracks versioning and embedding status for textbook pages. Contains page path, content hash (SHA-256), last embedded timestamp, chunk count. Used to determine when re-embedding is needed after content updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Content Quality & Completeness**
- **SC-001**: Textbook covers all 13 weeks of curriculum with no missing chapters or sections
- **SC-002**: Every chapter includes at least 3 learning outcomes, 5 code examples, and 2 diagrams
- **SC-003**: All internal links between pages are functional with zero broken links
- **SC-004**: Content passes accessibility audit with WCAG 2.1 Level AA compliance (Lighthouse Accessibility score >95)

**User Engagement & Learning**
- **SC-005**: Students can navigate from Chapter 1 to Capstone Project (complete curriculum) in under 5 clicks using sidebar navigation
- **SC-006**: Students spend an average of 8+ minutes per chapter page (indicating deep engagement)
- **SC-007**: Search functionality returns relevant results for 95% of common robotics queries (e.g., "PID control", "inverse kinematics")
- **SC-008**: Mobile users can read and interact with content without horizontal scrolling on devices 375px width and above

**Chatbot Performance**
- **SC-009**: Chatbot responds to user queries within 3 seconds for 95% of requests
- **SC-010**: Chatbot retrieves at least one relevant source citation for 90% of queries
- **SC-011**: Users rate chatbot responses positively (thumbs up) for 70% of interactions
- **SC-012**: Chatbot handles 100 concurrent users without performance degradation

**Personalization Effectiveness**
- **SC-013**: Users who set personalization preferences complete 30% more chapters than users with default settings
- **SC-014**: Authenticated users' preferences sync across devices within 2 seconds of login
- **SC-015**: Content variants (beginner vs. advanced) are visually distinct and appropriate for each skill level

**Translation Quality**
- **SC-016**: Urdu translations achieve 95% technical accuracy when reviewed by bilingual subject matter experts
- **SC-017**: Urdu content displays correctly with RTL layout in all major browsers (Chrome, Firefox, Safari, Edge)
- **SC-018**: Users can toggle between English and Urdu in under 2 seconds with no layout glitches

**Deployment & Reliability**
- **SC-019**: GitHub Actions deployment completes successfully within 5 minutes of code commit
- **SC-020**: Site achieves 99.9% uptime over a 30-day period
- **SC-021**: Lighthouse performance score remains above 90 for all pages
- **SC-022**: Backend RAG API maintains <200ms p95 response latency under normal load

**Content Generation Efficiency**
- **SC-023**: Content Writer Agent generates a complete weekly chapter (2000+ words) in under 10 minutes
- **SC-024**: Generated MDX passes syntax validation with zero errors requiring manual fixes
- **SC-025**: Automated content generation reduces manual writing time by 80% compared to traditional authoring

## Assumptions

1. **PDF Availability**: The "Hackathon I: Physical AI & Humanoid Robotics Textbook" PDF contains complete curriculum content for all 13 weeks. If unavailable, content will be based on standard Physical AI curriculum structure.

2. **Infrastructure Access**: Project has access to necessary cloud services: GitHub repository, Neon Serverless Postgres, Qdrant Free Tier, OpenAI API, and a deployment platform (Railway/Render/Fly.io).

3. **Content Licensing**: All textbook content, code examples, and diagrams can be published under an open-source or educational license compatible with public GitHub Pages hosting.

4. **Claude Code Availability**: Content generation assumes active Claude Code subscription with access to subagent features and sufficient API quota for processing curriculum content.

5. **Technical Glossary**: A baseline English-Urdu technical glossary exists or can be bootstrapped with common robotics terms. Translator Agent will expand this glossary during translation.

6. **User Demographics**: Primary audience is computer science students in Pakistan and South Asia, hence Urdu language priority. Secondary audience includes self-learners and professionals globally.

7. **Hardware Requirements Chapter**: While the textbook covers hardware (Jetson, Digital Twin workstations), it does not include physical hardware sales or distribution. Hardware sections are informational only.

8. **Code Examples**: All code examples use Python 3.11+ and ROS2 (latest stable release). Examples assume readers have basic Python knowledge.

9. **Browser Support**: Textbook targets modern evergreen browsers (Chrome, Firefox, Safari, Edge). No support for Internet Explorer or browsers >2 years old.

10. **Authentication Optionality**: Personalization features work without authentication (localStorage only), but cross-device sync requires login. Authentication is optional, not mandatory for reading content.

## Dependencies

1. **External Services**:
   - GitHub (repository hosting, Actions CI/CD, Pages deployment)
   - Neon Serverless Postgres (user data, chat history, content metadata)
   - Qdrant Free Tier (vector embeddings for RAG)
   - OpenAI API (embeddings via text-embedding-3-small, chat completions for RAG responses)
   - Cloud platform for backend (Railway, Render, or Fly.io)

2. **Development Tools**:
   - Node.js 18+ and npm (Docusaurus build)
   - Python 3.11+ (FastAPI backend)
   - Claude Code (content generation via subagents)
   - Git (version control)

3. **Frameworks & Libraries**:
   - Docusaurus v3.x (static site generator)
   - FastAPI (Python web framework for backend)
   - Better-Auth (authentication library)
   - React (Docusaurus frontend components)
   - OpenAI Python SDK (API integration)
   - Qdrant Python client (vector database)
   - Alembic (database migrations)

4. **Content Sources**:
   - "Hackathon I: Physical AI & Humanoid Robotics Textbook" PDF (primary curriculum source)
   - ROS2 official documentation (code examples)
   - NVIDIA Isaac Sim documentation (simulation content)
   - Gazebo tutorials (simulation examples)

5. **Constitution Compliance**:
   - This feature must adhere to all 8 core principles defined in `.specify/memory/constitution.md`, including Content Fidelity, Test-Driven Development, Multi-Agent Orchestration, Accessibility & Internationalization, Security & Privacy, Observability, Version Control, and Modularity.

## Out of Scope

1. **Live Instructor Support**: The chatbot provides textbook-based Q&A but does not connect students to live instructors or teaching assistants.

2. **Grading & Certification**: Self-assessment questions are for practice only. No automated grading, certificate issuance, or official academic credit.

3. **Downloadable Formats**: No PDF, EPUB, or offline downloads. Textbook is web-only (though Docusaurus generates static HTML that could be saved manually).

4. **Video Content**: No embedded video tutorials or lectures. Content is text, code, and static diagrams only.

5. **Interactive Simulations**: No in-browser robot simulations (e.g., no Gazebo/Isaac Sim running in the browser). Simulation chapters provide instructions for local installation.

6. **Discussion Forums**: No built-in student discussion boards or Q&A forums. Chatbot is the only interactive support feature.

7. **Physical Hardware Sales**: Hardware Requirements chapter is informational only. No e-commerce integration for purchasing Jetson kits or robot parts.

8. **Multi-Language Support Beyond Urdu**: Only English and Urdu are supported. No Spanish, Arabic, Hindi, or other languages.

9. **Collaborative Editing**: Content is authored and generated via Claude Code agents, not via user-contributed edits. No Wikipedia-style collaborative authoring.

10. **Social Features**: No user profiles (beyond authentication), follower systems, social sharing buttons, or gamification (badges, points).

11. **Custom Code Execution**: Code examples are static (syntax-highlighted text). No in-browser code execution environment or Jupyter notebook integration.

12. **Analytics Dashboard**: No admin dashboard for tracking user engagement metrics. Chatbot feedback is logged but not visualized in a UI.

## Notes

- **Content Fidelity Priority**: Per Constitution Principle I, all technical content must trace back to the source PDF or verified educational resources. Content Writer Agent must cite sources.

- **TDD Workflow**: Per Constitution Principle V (NON-NEGOTIABLE), all backend code (FastAPI, RAG pipeline, auth) must follow Red-Green-Refactor TDD. Frontend components should have React Testing Library tests.

- **Multi-Agent Coordination**: Content generation will use 7 specialized agents (ContentWriter, LayoutBuilder, RAGBuilder, BetterAuthIntegrator, UrduTranslator, PersonalizationEngine, GitHubDeployer). Agents run sequentially with outputs from one feeding into the next.

- **Urdu RTL Considerations**: Docusaurus i18n with `direction: 'rtl'` handles most RTL layout. Custom CSS may be needed for mixed LTR/RTL content (code blocks in Urdu pages).

- **RAG Context Window**: OpenAI models have token limits. If retrieved chunks exceed context window, implement chunk prioritization (highest similarity scores first) and truncation with warning.

- **Personalization Granularity**: Initial implementation shows/hides entire content sections based on skill level. Future enhancement could support inline conditional rendering (beginner sees explanation, advanced sees only equation).

- **Deployment Strategy**: Use GitHub Pages for frontend (free, CDN-backed, automatic SSL). Backend on Railway free tier initially, with migration path to paid tier or Render if free tier limits are exceeded.

- **Secrets Management**: All API keys (OpenAI, Neon, Qdrant) must be stored as environment variables, never committed to Git. Use GitHub Secrets for CI/CD workflows.

- **Monitoring & Logging**: Per Constitution Principle VI, all backend services must emit structured JSON logs with correlation IDs. Use cloud platform's native logging (Railway logs, Render logs) initially.

- **Version Bumping**: Use semantic versioning for textbook content. MAJOR bump for curriculum restructure, MINOR for new chapters, PATCH for typo fixes. Track in `website/package.json` version field.

- **Accessibility Testing**: Run automated Lighthouse audits in CI pipeline. Manual screen reader testing recommended for key pages (Chapter 1, Capstone Project).
