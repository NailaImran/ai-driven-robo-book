# Physical AI & Humanoid Robotics Textbook Constitution

<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added sections: Complete constitution structure for Docusaurus-based textbook
- Modified principles: All 8 core principles defined
- Templates requiring updates:
  ✅ constitution.md - Created
  ⚠ plan-template.md - Review alignment with principles
  ⚠ spec-template.md - Review scope/requirements alignment
  ⚠ tasks-template.md - Review task categorization
- Follow-up TODOs: Verify PDF content when available; Update RAG schemas after Neon/Qdrant setup
-->

## Project Overview

**Project Name**: Physical AI & Humanoid Robotics Interactive Textbook

**Mission**: Create a comprehensive, interactive, and multilingual educational platform for Physical AI and Humanoid Robotics using Docusaurus, AI-powered content generation, RAG chatbot assistance, and deployment on GitHub Pages.

**Audience**:
- Computer Science students in their first year of university
- Self-learners interested in Physical AI and robotics
- Educators seeking structured curriculum materials
- Urdu-speaking learners requiring native language support

**Scope**:
- Full 13-week curriculum covering Physical AI fundamentals through capstone project
- Interactive Docusaurus-based web textbook with personalization features
- RAG-powered chatbot for context-aware Q&A
- Multi-language support (English primary, Urdu translation)
- Authentication system for personalized learning experiences
- Cloud-native architecture with modern deployment practices

**Deliverables**:
1. Complete Docusaurus textbook deployed on GitHub Pages
2. FastAPI backend with RAG chatbot integration
3. Neon Serverless Postgres database for user data and content metadata
4. Qdrant vector database for semantic search
5. Better-Auth authentication system
6. Personalization engine for adaptive content
7. One-click Urdu translation system
8. Claude Code subagents for automated content generation
9. Reusable skills library for common operations

## Core Principles

### I. Content Fidelity
All textbook content MUST be derived from authoritative source materials (PDF curriculum, verified educational resources). No hallucinated or speculative content permitted in educational modules. Each chapter, code example, and diagram must trace back to source material or be explicitly marked as supplementary content with proper attribution.

**Rationale**: Educational integrity requires factual accuracy. Students deserve trustworthy learning materials that align with established curriculum standards.

### II. Modularity & Reusability
Every component—content modules, agents, skills, UI components—MUST be self-contained, independently testable, and reusable across different contexts. Docusaurus pages follow MDX module pattern. Agents expose clear interfaces. Skills are parameterized functions stored in `.claude/skills/`.

**Rationale**: Modular architecture enables rapid iteration, easier maintenance, parallel development, and knowledge reuse across similar educational projects.

### III. Multi-Agent Orchestration
Complex tasks MUST be decomposed and delegated to specialized Claude Code subagents. Each subagent has a single responsibility (content writing, layout, deployment, translation, RAG, auth). Subagents communicate through well-defined schemas and produce atomic, verifiable outputs.

**Rationale**: Agent specialization improves output quality, enables parallel execution, reduces cognitive load, and aligns with microservices architectural patterns.

### IV. Accessibility & Internationalization
All content MUST support multilingual delivery (English primary, Urdu translation via one-click button). UI components follow WCAG 2.1 Level AA standards. Translation preserves technical accuracy and context. Personalization respects user preferences (language, learning pace, persona).

**Rationale**: Education should be inclusive and culturally accessible. Urdu support opens learning to millions of native speakers in Pakistan and broader South Asian diaspora.

### V. Test-Driven Development (NON-NEGOTIABLE)
All functional code (FastAPI endpoints, RAG pipeline, auth flows, personalization logic) MUST follow TDD: Write tests → Get approval → Red (tests fail) → Green (implementation) → Refactor. Docusaurus content generation uses validation checks (broken links, missing images, schema compliance).

**Rationale**: TDD ensures correctness before deployment, reduces bugs, provides living documentation, and enables confident refactoring.

### VI. Observability & Debugging
Every system component MUST emit structured logs (JSON format) with correlation IDs. FastAPI uses middleware for request tracing. RAG queries log: user query, retrieved chunks, embedding vector metadata, response generation time. Deployment pipeline logs build steps, test results, deployment status.

**Rationale**: Observability enables rapid debugging, performance optimization, and understanding system behavior in production. Essential for maintaining complex multi-service architecture.

### VII. Version Control & Semantic Versioning
All artifacts use semantic versioning (MAJOR.MINOR.PATCH). Breaking changes to RAG API, schema migrations, or authentication flow require MAJOR bump. New chapters or features require MINOR bump. Bug fixes and content corrections require PATCH bump. Git follows trunk-based development with feature branches.

**Rationale**: Clear versioning communicates impact of changes, enables rollback strategies, and maintains API contract guarantees for frontend-backend integration.

### VIII. Security & Privacy
User authentication MUST use Better-Auth with secure token handling. Passwords hashed with bcrypt (min 12 rounds). PII stored in Neon Postgres encrypted at rest. RAG chatbot MUST NOT leak user data across sessions. API endpoints validate inputs, sanitize outputs, rate-limit requests. Secrets managed via environment variables, never committed to git.

**Rationale**: Educational platforms handle student data requiring GDPR/FERPA compliance considerations. Security breaches destroy user trust and violate ethical obligations.

## Technology Stack Requirements

### Frontend Stack
- **Framework**: Docusaurus v3.x (React-based static site generator)
- **Styling**: Custom CSS modules + Docusaurus theming API
- **State Management**: React Context for user preferences, personalization settings
- **Components**: MDX for interactive content, custom React components for personalization/translation buttons
- **Build Tool**: Docusaurus CLI with custom plugins for RAG chatbot embed, auth integration

### Backend Stack
- **API Framework**: FastAPI (Python 3.11+) with async/await for concurrent request handling
- **Authentication**: Better-Auth with session management, JWT tokens
- **Database (Relational)**: Neon Serverless Postgres (user profiles, content metadata, personalization settings)
- **Database (Vector)**: Qdrant Free Tier (embeddings for RAG semantic search)
- **Embeddings**: OpenAI Embeddings API (text-embedding-3-small model)
- **LLM Integration**: OpenAI Agents/ChatKit for RAG response generation
- **API Documentation**: FastAPI auto-generated OpenAPI/Swagger docs

### Development & Deployment
- **Version Control**: Git with GitHub repository
- **CI/CD**: GitHub Actions (build, test, deploy pipeline)
- **Hosting (Frontend)**: GitHub Pages (static site hosting)
- **Hosting (Backend)**: Railway/Render/Fly.io (FastAPI service)
- **Environment Management**: Python virtual environments, .env files for secrets
- **Content Generation**: Claude Code + Spec-Kit Plus workflow

### Agent & Automation Tools
- **Agent Orchestration**: Claude Code subagents (defined in `.claude/agents/`)
- **Reusable Skills**: Stored in `.claude/skills/` (e.g., markdown generation, API testing, translation)
- **Slash Commands**: Custom commands in `.claude/commands/` for workflow automation

## Project Structure

```
learn-humanoid-robotics/
├── .claude/                          # Claude Code configuration
│   ├── agents/                       # Subagent definitions
│   │   ├── content-writer.md         # Generates chapter content from specs
│   │   ├── docusaurus-layout.md      # Creates Docusaurus pages/sidebars
│   │   ├── rag-builder.md            # Sets up RAG pipeline
│   │   ├── auth-integrator.md        # Implements Better-Auth
│   │   ├── translator.md             # Handles Urdu translation
│   │   └── deployment.md             # Manages GitHub Pages deployment
│   ├── skills/                       # Reusable functions
│   │   ├── generate-mdx.skill.md     # MDX page generation
│   │   ├── validate-links.skill.md   # Broken link checking
│   │   └── translate-content.skill.md # Translation utilities
│   └── commands/                     # Custom slash commands
│       ├── sp.constitution.md        # Constitution management
│       ├── sp.specify.md             # Feature specification
│       ├── sp.plan.md                # Architecture planning
│       ├── sp.tasks.md               # Task generation
│       └── sp.implement.md           # Implementation workflow
│
├── .specify/                         # Spec-Kit Plus artifacts
│   ├── memory/
│   │   └── constitution.md           # This file
│   ├── templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   └── phr-template.prompt.md
│   └── scripts/
│       └── bash/                     # Automation scripts
│
├── specs/                            # Feature specifications
│   ├── textbook-content/
│   │   ├── spec.md                   # Content structure spec
│   │   ├── plan.md                   # Content generation plan
│   │   └── tasks.md                  # Content creation tasks
│   ├── rag-chatbot/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   ├── personalization/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── deployment/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
│
├── history/                          # Development history
│   ├── prompts/                      # Prompt History Records
│   │   ├── constitution/             # Constitution-related PHRs
│   │   ├── textbook-content/         # Feature-specific PHRs
│   │   ├── rag-chatbot/
│   │   └── general/                  # General PHRs
│   └── adr/                          # Architecture Decision Records
│       ├── 001-docusaurus-framework.md
│       ├── 002-rag-architecture.md
│       ├── 003-translation-strategy.md
│       └── 004-deployment-platform.md
│
├── website/                          # Docusaurus project root
│   ├── docs/                         # Main textbook content
│   │   ├── 01-quarter-overview/
│   │   │   ├── index.mdx
│   │   │   ├── why-physical-ai.mdx
│   │   │   └── learning-outcomes.mdx
│   │   ├── 02-course-structure/
│   │   │   ├── index.mdx
│   │   │   ├── week-01-fundamentals.mdx
│   │   │   ├── week-02-kinematics.mdx
│   │   │   └── ... (weeks 03-13)
│   │   ├── 03-hardware/
│   │   │   ├── index.mdx
│   │   │   ├── digital-twin-workstation.mdx
│   │   │   ├── jetson-kit.mdx
│   │   │   └── simulation-tools.mdx
│   │   ├── 04-architecture/
│   │   │   ├── index.mdx
│   │   │   ├── cloud-native-design.mdx
│   │   │   └── system-integration.mdx
│   │   ├── 05-capstone/
│   │   │   ├── index.mdx
│   │   │   ├── project-requirements.mdx
│   │   │   └── evaluation-criteria.mdx
│   │   └── 06-assessments/
│   │       ├── index.mdx
│   │       ├── lab-assignments.mdx
│   │       └── final-project.mdx
│   ├── src/
│   │   ├── components/               # Custom React components
│   │   │   ├── PersonalizationButton.tsx
│   │   │   ├── UrduTranslateButton.tsx
│   │   │   ├── RAGChatbot.tsx
│   │   │   └── AuthWidget.tsx
│   │   ├── css/
│   │   │   └── custom.css
│   │   └── pages/                    # Landing/static pages
│   │       ├── index.tsx
│   │       └── login.tsx
│   ├── static/                       # Static assets
│   │   ├── img/
│   │   │   ├── diagrams/
│   │   │   ├── hardware/
│   │   │   └── screenshots/
│   │   └── pdf/
│   │       └── source-curriculum.pdf
│   ├── docusaurus.config.js          # Docusaurus configuration
│   ├── sidebars.js                   # Sidebar navigation
│   └── package.json
│
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py           # Authentication endpoints
│   │   │   │   ├── rag.py            # RAG chatbot endpoints
│   │   │   │   ├── personalization.py # User preference endpoints
│   │   │   │   └── translation.py    # Translation service endpoints
│   │   │   └── dependencies.py       # Shared dependencies
│   │   ├── core/
│   │   │   ├── config.py             # Configuration management
│   │   │   ├── security.py           # Security utilities
│   │   │   └── logging.py            # Structured logging setup
│   │   ├── services/
│   │   │   ├── rag/
│   │   │   │   ├── embeddings.py     # OpenAI embeddings integration
│   │   │   │   ├── vectorstore.py    # Qdrant client
│   │   │   │   ├── retrieval.py      # Semantic search logic
│   │   │   │   └── generation.py     # LLM response generation
│   │   │   ├── auth/
│   │   │   │   ├── better_auth.py    # Better-Auth integration
│   │   │   │   └── session.py        # Session management
│   │   │   └── translation/
│   │   │       └── urdu_translator.py # Urdu translation service
│   │   ├── models/
│   │   │   ├── user.py               # User model (Postgres)
│   │   │   ├── content.py            # Content metadata model
│   │   │   └── personalization.py    # User preferences model
│   │   ├── schemas/
│   │   │   ├── auth.py               # Pydantic schemas for auth
│   │   │   ├── rag.py                # RAG request/response schemas
│   │   │   └── personalization.py    # Personalization schemas
│   │   └── main.py                   # FastAPI application entry
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_rag.py
│   │   ├── test_personalization.py
│   │   └── test_translation.py
│   ├── alembic/                      # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── requirements.txt
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml       # GitHub Pages deployment
│       ├── deploy-backend.yml        # Backend deployment
│       └── run-tests.yml             # CI testing
│
├── README.md                         # Project documentation
├── .gitignore
└── .env.example                      # Environment variables template
```

## Book Content Structure (13-Week Curriculum)

### Chapter 1: Quarter Overview & Introduction
**Purpose**: Introduce students to Physical AI, humanoid robotics, and course structure.

**Learning Outcomes**:
- Define Physical AI and its real-world applications
- Understand the scope of humanoid robotics as a field
- Identify learning objectives for the 13-week course
- Recognize career pathways in robotics engineering

**Pages**:
1. `index.mdx` - Course introduction and navigation
2. `why-physical-ai.mdx` - Importance and market trends
3. `learning-outcomes.mdx` - Detailed learning objectives
4. `prerequisites.mdx` - Required knowledge and skills

**Code Blocks**: Python environment setup, ROS2 installation verification
**Diagrams**: Physical AI ecosystem map, humanoid robot anatomy
**Personalization**: Beginner vs. intermediate learner paths
**Urdu Translation**: All pages fully translatable

### Chapter 2: 13-Week Course Breakdown
**Purpose**: Provide week-by-week curriculum structure with detailed syllabi.

**Learning Outcomes**:
- Navigate weekly topics and deliverables
- Understand progression from fundamentals to capstone
- Align personal learning pace with course milestones

**Pages** (one per week):
1. `week-01-fundamentals.mdx` - Robotics basics, coordinate systems
2. `week-02-kinematics.mdx` - Forward/inverse kinematics
3. `week-03-dynamics.mdx` - Equations of motion, torque
4. `week-04-control-theory.mdx` - PID control, stability
5. `week-05-sensors.mdx` - IMUs, encoders, force sensors
6. `week-06-actuators.mdx` - Motors, servos, hydraulics
7. `week-07-perception.mdx` - Computer vision, depth sensing
8. `week-08-planning.mdx` - Path planning, obstacle avoidance
9. `week-09-grasping.mdx` - Manipulation, gripper control
10. `week-10-locomotion.mdx` - Walking gaits, balance
11. `week-11-simulation.mdx` - Gazebo, Isaac Sim
12. `week-12-integration.mdx` - Full system integration
13. `week-13-capstone.mdx` - Final project presentations

**Code Blocks**: Weekly coding exercises, ROS2 nodes, simulation scripts
**Diagrams**: Concept maps, flowcharts, system architectures per week
**Personalization**: Industry professional vs. academic researcher focus
**Urdu Translation**: Technical terms glossary maintained

### Chapter 3: Hardware Requirements
**Purpose**: Specify required and optional hardware for hands-on learning.

**Learning Outcomes**:
- Identify minimum hardware for course completion
- Understand trade-offs between simulation and physical robots
- Evaluate budget options for personal setups

**Pages**:
1. `index.mdx` - Hardware overview and decision matrix
2. `digital-twin-workstation.mdx` - PC specs for simulation (GPU, RAM, storage)
3. `jetson-kit.mdx` - NVIDIA Jetson Nano/Orin setup for edge AI
4. `simulation-tools.mdx` - Gazebo, Isaac Sim, Webots installation
5. `robot-lab-options.mdx` - University lab access vs. personal hardware

**Code Blocks**: Hardware diagnostic scripts, driver installations
**Diagrams**: Hardware architecture diagrams, connection schematics
**Personalization**: Budget-conscious vs. professional-grade hardware recommendations
**Urdu Translation**: Hardware terminology localized

### Chapter 4: Software Architecture
**Purpose**: Design cloud-native robotics systems with modern DevOps practices.

**Learning Outcomes**:
- Architect distributed robotics systems
- Implement ROS2 with cloud integration
- Apply containerization (Docker) to robotics workflows
- Design for scalability and fault tolerance

**Pages**:
1. `index.mdx` - Architecture principles for robotics
2. `cloud-native-design.mdx` - Microservices, edge-cloud hybrid
3. `ros2-fundamentals.mdx` - Nodes, topics, services, actions
4. `containerization.mdx` - Docker for ROS2, multi-stage builds
5. `deployment-strategies.mdx` - CI/CD for robotics, fleet management

**Code Blocks**: Docker Compose files, ROS2 launch files, Kubernetes manifests
**Diagrams**: System architecture diagrams, deployment pipelines
**Personalization**: Startup CTO vs. research engineer perspectives
**Urdu Translation**: DevOps terminology translated

### Chapter 5: Capstone Project
**Purpose**: Guide students through final integrative project demonstrating mastery.

**Learning Outcomes**:
- Design end-to-end humanoid robot application
- Integrate perception, planning, control subsystems
- Document technical decisions and trade-offs
- Present working prototype with evaluation metrics

**Pages**:
1. `index.mdx` - Capstone overview and timeline
2. `project-requirements.mdx` - Functional and non-functional requirements
3. `design-phase.mdx` - System design, component selection
4. `implementation-phase.mdx` - Build, test, iterate workflow
5. `evaluation-criteria.mdx` - Grading rubric, success metrics
6. `presentation-guidelines.mdx` - Demo preparation, technical report

**Code Blocks**: Starter templates, reference implementations
**Diagrams**: Example project architectures, Gantt charts
**Personalization**: Solo project vs. team project guidance
**Urdu Translation**: Project documentation templates in Urdu

### Chapter 6: Assessments & Evaluation
**Purpose**: Define assessment structure, rubrics, and learning checkpoints.

**Learning Outcomes**:
- Understand evaluation criteria for labs and projects
- Self-assess progress against learning objectives
- Prepare for quizzes and practical examinations

**Pages**:
1. `index.mdx` - Assessment philosophy and structure
2. `lab-assignments.mdx` - Weekly lab deliverables and rubrics
3. `midterm-exam.mdx` - Mid-quarter theoretical and practical exam
4. `final-project.mdx` - Capstone evaluation criteria
5. `self-assessment.mdx` - Reflection exercises, peer review

**Code Blocks**: Auto-grading scripts, test harnesses
**Diagrams**: Assessment flowchart, grading distribution
**Personalization**: Self-paced vs. cohort-based assessment timelines
**Urdu Translation**: Assessment instructions in Urdu

## Multi-Agent Blueprint

### Agent 1: Content Writer Agent
**Purpose**: Generate MDX content for textbook chapters based on source curriculum and specifications.

**Input Schema**:
```json
{
  "chapter_id": "string",
  "chapter_title": "string",
  "source_material": "string (PDF path or text content)",
  "learning_outcomes": ["string"],
  "target_audience": "beginner | intermediate | advanced",
  "language": "en | ur"
}
```

**Output Schema**:
```json
{
  "mdx_files": [
    {
      "filename": "string",
      "content": "string (MDX markup)",
      "word_count": "number",
      "code_blocks": ["string"],
      "images_required": ["string"]
    }
  ],
  "validation": {
    "broken_links": ["string"],
    "missing_images": ["string"],
    "technical_accuracy_check": "passed | failed"
  }
}
```

**Reusable Skills**:
- `generate-mdx.skill.md` - Convert outline to MDX
- `validate-links.skill.md` - Check internal/external links
- `extract-code-blocks.skill.md` - Parse code examples from source

**Tools Required**: Read, Write, Grep (for existing content), WebFetch (for external references)

### Agent 2: Docusaurus Layout Agent
**Purpose**: Configure Docusaurus structure, sidebars, navigation, and theming.

**Input Schema**:
```json
{
  "site_config": {
    "title": "string",
    "tagline": "string",
    "url": "string",
    "baseUrl": "string"
  },
  "sidebar_structure": [
    {
      "category": "string",
      "pages": ["string"]
    }
  ],
  "theme_customization": {
    "primary_color": "string",
    "navbar_items": ["object"]
  }
}
```

**Output Schema**:
```json
{
  "config_files": {
    "docusaurus.config.js": "string",
    "sidebars.js": "string"
  },
  "component_files": [
    {
      "filename": "string",
      "content": "string (TSX/JSX)"
    }
  ],
  "validation": {
    "build_test": "passed | failed",
    "accessibility_score": "number"
  }
}
```

**Reusable Skills**:
- `generate-sidebar.skill.md` - Auto-generate sidebar from folder structure
- `validate-docusaurus-config.skill.md` - Schema validation
- `test-build.skill.md` - Run `npm run build` and capture errors

**Tools Required**: Write, Edit, Bash (for npm commands)

### Agent 3: GitHub Deployment Agent
**Purpose**: Automate GitHub Pages deployment with CI/CD workflows.

**Input Schema**:
```json
{
  "repository": {
    "owner": "string",
    "name": "string",
    "branch": "main | master"
  },
  "deployment_config": {
    "build_command": "string",
    "output_directory": "string",
    "custom_domain": "string (optional)"
  }
}
```

**Output Schema**:
```json
{
  "workflow_file": "string (.github/workflows/deploy.yml)",
  "deployment_url": "string",
  "validation": {
    "workflow_syntax_check": "passed | failed",
    "test_deployment": "passed | failed"
  }
}
```

**Reusable Skills**:
- `generate-gh-workflow.skill.md` - GitHub Actions YAML generation
- `validate-yaml.skill.md` - YAML syntax validation
- `test-deployment.skill.md` - Trigger test build

**Tools Required**: Write, Bash (for git commands, gh CLI)

### Agent 4: RAG Chatbot Builder Agent
**Purpose**: Implement end-to-end RAG pipeline with OpenAI, Qdrant, and FastAPI.

**Input Schema**:
```json
{
  "content_source": {
    "docusaurus_docs_path": "string",
    "chunk_size": "number (default: 512)",
    "chunk_overlap": "number (default: 50)"
  },
  "embedding_config": {
    "model": "text-embedding-3-small",
    "api_key_env_var": "OPENAI_API_KEY"
  },
  "retrieval_config": {
    "top_k": "number (default: 5)",
    "similarity_threshold": "number (default: 0.7)"
  }
}
```

**Output Schema**:
```json
{
  "backend_files": [
    {
      "path": "string",
      "content": "string (Python code)"
    }
  ],
  "database_schemas": {
    "qdrant_collection": "object",
    "postgres_tables": ["object"]
  },
  "api_endpoints": [
    {
      "path": "string",
      "method": "string",
      "request_schema": "object",
      "response_schema": "object"
    }
  ],
  "validation": {
    "embedding_test": "passed | failed",
    "retrieval_test": "passed | failed",
    "end_to_end_test": "passed | failed"
  }
}
```

**Reusable Skills**:
- `chunk-markdown.skill.md` - Split MDX into semantic chunks
- `generate-embeddings.skill.md` - Batch embedding generation
- `setup-qdrant.skill.md` - Collection initialization
- `test-rag-pipeline.skill.md` - End-to-end RAG testing

**Tools Required**: Write, Edit, Bash (for database setup), Read (for content processing)

### Agent 5: Better-Auth Integration Agent
**Purpose**: Implement secure authentication with Better-Auth, session management, and user profiles.

**Input Schema**:
```json
{
  "auth_config": {
    "providers": ["credentials", "google", "github"],
    "session_strategy": "jwt | database",
    "token_expiry": "number (seconds)"
  },
  "database_config": {
    "postgres_url": "string (env var reference)",
    "user_table_schema": "object"
  }
}
```

**Output Schema**:
```json
{
  "backend_files": [
    {
      "path": "backend/app/api/routes/auth.py",
      "content": "string (FastAPI routes)"
    },
    {
      "path": "backend/app/services/auth/better_auth.py",
      "content": "string (Better-Auth integration)"
    }
  ],
  "frontend_components": [
    {
      "path": "website/src/components/AuthWidget.tsx",
      "content": "string (React component)"
    }
  ],
  "migration_files": [
    {
      "path": "backend/alembic/versions/001_create_users.py",
      "content": "string (Alembic migration)"
    }
  ],
  "validation": {
    "auth_flow_test": "passed | failed",
    "security_audit": "passed | failed"
  }
}
```

**Reusable Skills**:
- `generate-auth-endpoints.skill.md` - FastAPI auth routes
- `setup-better-auth.skill.md` - Better-Auth configuration
- `test-auth-flow.skill.md` - Integration testing
- `security-audit.skill.md` - OWASP check

**Tools Required**: Write, Edit, Bash (for migrations)

### Agent 6: Urdu Translator Agent
**Purpose**: Translate English textbook content to Urdu while preserving technical accuracy and MDX structure.

**Input Schema**:
```json
{
  "source_file": "string (path to English MDX)",
  "translation_strategy": "full_page | incremental",
  "technical_glossary": "object (EN -> UR mappings)",
  "preserve_elements": ["code", "componentNames", "frontmatter"]
}
```

**Output Schema**:
```json
{
  "translated_file": {
    "path": "string (docs/ur/...)",
    "content": "string (Urdu MDX)",
    "word_count": "number"
  },
  "validation": {
    "mdx_syntax_valid": "boolean",
    "code_blocks_preserved": "boolean",
    "technical_terms_consistent": "boolean"
  },
  "glossary_updates": [
    {
      "en_term": "string",
      "ur_term": "string",
      "context": "string"
    }
  ]
}
```

**Reusable Skills**:
- `translate-content.skill.md` - AI-powered translation with context
- `preserve-mdx-structure.skill.md` - Parse and rebuild MDX
- `update-glossary.skill.md` - Maintain EN-UR terminology database

**Tools Required**: Read, Write, Edit, WebFetch (for translation APIs if needed)

### Agent 7: Personalization Engine Agent
**Purpose**: Implement adaptive content delivery based on user persona, learning pace, and preferences.

**Input Schema**:
```json
{
  "user_profile": {
    "persona": "student | educator | self_learner | industry_professional",
    "skill_level": "beginner | intermediate | advanced",
    "learning_pace": "accelerated | standard | extended",
    "language_preference": "en | ur"
  },
  "content_variants": [
    {
      "page_id": "string",
      "variants": {
        "beginner": "string (content)",
        "intermediate": "string (content)",
        "advanced": "string (content)"
      }
    }
  ]
}
```

**Output Schema**:
```json
{
  "personalization_service": {
    "path": "backend/app/services/personalization/engine.py",
    "content": "string (Python logic)"
  },
  "api_endpoints": [
    {
      "path": "/api/personalization/profile",
      "method": "GET | PUT",
      "schema": "object"
    }
  ],
  "frontend_components": [
    {
      "path": "website/src/components/PersonalizationButton.tsx",
      "content": "string (React component)"
    }
  ],
  "validation": {
    "persona_routing_test": "passed | failed",
    "preference_persistence_test": "passed | failed"
  }
}
```

**Reusable Skills**:
- `generate-content-variants.skill.md` - Create persona-specific content
- `route-by-persona.skill.md` - Conditional rendering logic
- `test-personalization.skill.md` - User journey testing

**Tools Required**: Write, Edit, Read (for content analysis)

## RAG Chatbot Specification

### Chunking Strategy
**Approach**: Semantic chunking with overlap to preserve context.

**Implementation**:
1. Parse all MDX files in `website/docs/`
2. Remove frontmatter, preserve headings and code blocks
3. Split on heading boundaries (h2, h3) as primary chunks
4. For long sections (>1000 tokens), apply sliding window with 512 token chunks and 50 token overlap
5. Store metadata: `{chapter_id, section_title, page_url, chunk_index}`

**Code Reference**: `backend/app/services/rag/chunking.py`

### Embedding Strategy
**Model**: OpenAI `text-embedding-3-small` (1536 dimensions, cost-effective)

**Batch Processing**:
1. Collect all chunks (estimate: 500-1000 chunks for full textbook)
2. Batch embed in groups of 100 (OpenAI API rate limit consideration)
3. Store embeddings in Qdrant with payload metadata
4. Cache embeddings to avoid recomputation on content updates (use content hash)

**Code Reference**: `backend/app/services/rag/embeddings.py`

### Postgres Schema (Neon Serverless)

```sql
-- User authentication and profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User personalization preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    persona VARCHAR(50) CHECK (persona IN ('student', 'educator', 'self_learner', 'industry_professional')),
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    learning_pace VARCHAR(20) CHECK (learning_pace IN ('accelerated', 'standard', 'extended')),
    language_preference VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Content metadata for tracking updates and versioning
CREATE TABLE content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(500) NOT NULL UNIQUE,
    content_hash VARCHAR(64) NOT NULL, -- SHA-256 of content
    last_embedded_at TIMESTAMPTZ,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history for analytics and improvement
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    retrieved_chunks JSONB, -- Store chunk metadata
    response_time_ms INTEGER,
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_prefs_user_id ON user_preferences(user_id);
CREATE INDEX idx_content_hash ON content_metadata(content_hash);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);
```

### Qdrant Schema

**Collection Name**: `humanoid_robotics_textbook`

**Vector Configuration**:
```json
{
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  }
}
```

**Payload Schema**:
```json
{
  "chapter_id": "string (e.g., '01-quarter-overview')",
  "section_title": "string",
  "page_url": "string (relative URL for Docusaurus)",
  "chunk_index": "number",
  "content": "string (original text chunk)",
  "content_hash": "string (for deduplication)",
  "language": "string (en | ur)",
  "embedding_model": "string (text-embedding-3-small)",
  "created_at": "timestamp"
}
```

**Indexes**:
- Create payload index on `chapter_id` for filtered searches
- Create payload index on `language` for language-specific retrieval

**Code Reference**: `backend/app/services/rag/vectorstore.py`

### FastAPI Routes

**Base Path**: `/api/rag`

**Endpoints**:

1. **POST /api/rag/query**
   - **Description**: Submit question, retrieve relevant chunks, generate answer
   - **Request Schema**:
     ```json
     {
       "query": "string",
       "language": "en | ur (optional, default: en)",
       "chapter_filter": "string (optional, e.g., '02-course-structure')",
       "top_k": "number (optional, default: 5)",
       "answer_mode": "full_context | selected_text_only"
     }
     ```
   - **Response Schema**:
     ```json
     {
       "query": "string",
       "answer": "string",
       "sources": [
         {
           "chapter_id": "string",
           "section_title": "string",
           "page_url": "string",
           "snippet": "string (excerpt)",
           "relevance_score": "number"
         }
       ],
       "response_time_ms": "number"
     }
     ```

2. **POST /api/rag/embed-content**
   - **Description**: Admin endpoint to trigger content embedding/re-embedding
   - **Request Schema**:
     ```json
     {
       "force_reembed": "boolean (optional, default: false)",
       "chapter_filter": "string (optional)"
     }
     ```
   - **Response Schema**:
     ```json
     {
       "status": "success | error",
       "chunks_processed": "number",
       "embedding_time_ms": "number",
       "errors": ["string"]
     }
     ```

3. **GET /api/rag/health**
   - **Description**: Health check for RAG services (Qdrant, OpenAI connectivity)
   - **Response Schema**:
     ```json
     {
       "qdrant_status": "connected | disconnected",
       "openai_status": "connected | disconnected",
       "total_chunks": "number",
       "last_embed_time": "timestamp"
     }
     ```

**Code Reference**: `backend/app/api/routes/rag.py`

### ChatKit/OpenAI Agents Integration

**Strategy**: Use OpenAI Assistants API with retrieval-augmented generation.

**Workflow**:
1. User submits query via frontend chatbot widget
2. Frontend calls POST /api/rag/query
3. Backend retrieves top-k chunks from Qdrant (semantic search)
4. Construct prompt with system message + retrieved chunks + user query
5. Call OpenAI Chat Completions API (model: gpt-4o-mini for cost efficiency)
6. Stream response back to frontend
7. Log query, response, and retrieved chunks to `chat_history` table

**Prompt Template**:
```
System: You are a helpful teaching assistant for a Physical AI and Humanoid Robotics textbook. Answer questions using ONLY the provided context from the textbook. If the answer is not in the context, say "I don't have enough information in the textbook to answer that question. Please refer to the full chapter or ask your instructor."

Context:
{retrieved_chunks}

User Question: {user_query}
```

**Code Reference**: `backend/app/services/rag/generation.py`

### "Answer from Selected Text Only" Mode

**Feature**: Allow users to highlight text in a chapter and ask questions specifically about that selection.

**Implementation**:
1. Frontend captures selected text via `window.getSelection()`
2. Pass selected text as additional context parameter in API request
3. Backend creates isolated context: selected text + immediate surrounding paragraphs (±1)
4. RAG pipeline uses only this focused context instead of semantic search across entire corpus
5. Prompt explicitly instructs LLM to answer only from highlighted section

**Use Case**: Deep dive on specific algorithms, code examples, or technical explanations without broader textbook noise.

**Code Reference**: `website/src/components/RAGChatbot.tsx`, `backend/app/api/routes/rag.py:query_selected_text`

### Frontend Embed Code

**React Component**: `website/src/components/RAGChatbot.tsx`

**Features**:
- Floating chat widget (bottom-right corner, collapsible)
- Text input with send button
- Streaming response display (token-by-token rendering)
- Source citations (links to textbook sections)
- Language selector (English/Urdu)
- Chapter filter dropdown
- "Ask about selected text" mode toggle
- Feedback buttons (thumbs up/down)

**Integration**: Import component in Docusaurus theme wrapper (`src/theme/Root.tsx`) for global availability.

**Code Reference**: `website/src/components/RAGChatbot.tsx`

## Personalization & Urdu Translation Features

### Button Placement

**Personalization Button**:
- **Location**: Top-right corner of every content page (MDX), next to language selector
- **Icon**: User profile icon with gear overlay
- **Modal Trigger**: Opens personalization settings modal

**Urdu Translation Button**:
- **Location**: Top navigation bar (Docusaurus navbar), alongside theme toggle
- **Icon**: Globe icon with "اردو" text
- **Action**: Toggle language preference, reload page with Urdu content

**Code References**:
- `website/src/components/PersonalizationButton.tsx`
- `website/src/components/UrduTranslateButton.tsx`

### Personalization Logic

**User Profile Fields** (stored in `user_preferences` table):
1. **Persona**: student | educator | self_learner | industry_professional
2. **Skill Level**: beginner | intermediate | advanced
3. **Learning Pace**: accelerated | standard | extended
4. **Language Preference**: en | ur

**Content Adaptation Rules**:
- **Beginner**: More foundational explanations, step-by-step walkthroughs, visual diagrams emphasized
- **Intermediate**: Balanced theory and practice, code examples with annotations
- **Advanced**: Research papers cited, optimization techniques, advanced topics expanded
- **Student**: Assessment-focused, exam tips, peer learning suggestions
- **Educator**: Teaching notes, discussion prompts, assignment ideas
- **Self-Learner**: Self-assessment quizzes, project-based learning paths
- **Industry Professional**: Real-world applications, case studies, ROI considerations

**Implementation**:
1. User sets preferences via PersonalizationButton modal
2. Frontend stores preferences in localStorage + syncs to backend (PUT /api/personalization/profile)
3. On page load, frontend fetches user profile (GET /api/personalization/profile)
4. MDX pages use conditional rendering: `{persona === 'student' ? <StudentContent /> : <ProfessionalContent />}`
5. Server-side rendering (SSR) not required; client-side conditional rendering sufficient for Docusaurus

**Code References**:
- `backend/app/api/routes/personalization.py`
- `website/src/components/PersonalizationButton.tsx`
- `website/docs/**/*.mdx` (MDX pages with conditional content blocks)

### Urdu Translation Workflow

**Process**:
1. **Source Content**: English MDX in `website/docs/`
2. **Translation Agent**: Urdu Translator Agent (Agent 6) processes each page
3. **Output**: Urdu MDX in `website/i18n/ur/docusaurus-plugin-content-docs/current/`
4. **Docusaurus i18n**: Configure Docusaurus i18n plugin for Urdu locale
5. **Technical Glossary**: Maintain `website/i18n/glossary-en-ur.json` with EN→UR term mappings
6. **Validation**: MDX syntax check, code block preservation, link verification

**Docusaurus Configuration** (`docusaurus.config.js`):
```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      ur: { label: 'اردو', direction: 'rtl' }
    }
  }
};
```

**Code References**:
- `.claude/agents/translator.md`
- `website/i18n/ur/` (Urdu translations)
- `website/i18n/glossary-en-ur.json` (terminology database)

### Storage of Personalized Settings

**Frontend (Client-Side)**:
- **localStorage**: Immediate persistence for offline capability
- **Key**: `robotics_textbook_user_prefs`
- **Value**: JSON object `{ persona, skill_level, learning_pace, language_preference }`

**Backend (Server-Side)**:
- **Database**: `user_preferences` table in Neon Postgres
- **Authentication**: Requires user login (Better-Auth session)
- **Sync Strategy**: Optimistic updates (write to localStorage immediately, sync to backend asynchronously)
- **Conflict Resolution**: Server state wins on login; merge on conflict (last-write-wins with timestamp)

**Code References**:
- `website/src/utils/userPreferences.ts` (localStorage utilities)
- `backend/app/models/personalization.py` (SQLAlchemy model)
- `backend/app/api/routes/personalization.py` (CRUD endpoints)

### Page Re-Rendering Rules

**Trigger Events**:
1. User changes persona/skill level in personalization modal → immediate re-render
2. User toggles language (EN ↔ UR) → page reload with new locale
3. User logs in → fetch server preferences, merge with local, re-render if changes

**Re-Rendering Strategy**:
- **React State**: PersonalizationContext (React Context API) holds user preferences
- **Conditional Rendering**: MDX pages consume context via `usePersonalization()` hook
- **No Full Page Reload**: Only for language changes (Docusaurus locale switch requires reload)
- **Smooth Transitions**: Use React Suspense for loading states during content swaps

**Example MDX Usage**:
```mdx
import { usePersonalization } from '@site/src/hooks/usePersonalization';

export const PersonalizedContent = () => {
  const { persona, skillLevel } = usePersonalization();

  if (skillLevel === 'beginner') {
    return <BeginnerExplanation />;
  } else if (skillLevel === 'advanced') {
    return <AdvancedTopics />;
  }
  return <IntermediateContent />;
};

# Week 1: Robotics Fundamentals

<PersonalizedContent />
```

**Code References**:
- `website/src/context/PersonalizationContext.tsx`
- `website/src/hooks/usePersonalization.ts`

## GitHub Pages Deployment Specification

### Branch Strategy

**Branches**:
- `main` (or `master`): Production-ready code, protected branch
- `develop`: Integration branch for feature merging
- `feature/*`: Individual feature branches (e.g., `feature/rag-chatbot`, `feature/urdu-translation`)

**Deployment Branch**:
- `gh-pages`: Auto-generated by GitHub Actions, contains built static site (Docusaurus `build/` output)

**Workflow**:
1. Developers push to `feature/*` branches
2. Open PR to `develop`
3. CI runs tests, linting, build verification
4. Merge to `develop` after review
5. Periodic merges from `develop` to `main` (release cadence)
6. GitHub Actions triggered on `main` push → builds Docusaurus → deploys to `gh-pages`

**Code References**: `.github/workflows/deploy-frontend.yml`

### Docusaurus Configuration

**File**: `website/docusaurus.config.js`

**Key Settings**:
```javascript
module.exports = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'Master Physical AI from Fundamentals to Capstone',
  url: 'https://<username>.github.io',
  baseUrl: '/learn-humanoid-robotics/',
  organizationName: '<github-username>',
  projectName: 'learn-humanoid-robotics',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/<username>/learn-humanoid-robotics/tree/main/website/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  themeConfig: {
    navbar: {
      title: 'Physical AI Textbook',
      items: [
        { type: 'doc', docId: 'intro', label: 'Textbook', position: 'left' },
        { type: 'localeDropdown', position: 'right' },
        { href: 'https://github.com/<username>/learn-humanoid-robotics', label: 'GitHub', position: 'right' }
      ]
    }
  }
};
```

**Code Reference**: `website/docusaurus.config.js`

### Build Pipeline

**Steps**:
1. **Install Dependencies**: `npm ci` (clean install from lockfile)
2. **Lint**: `npm run lint` (ESLint for TypeScript/JavaScript)
3. **Type Check**: `npm run typecheck` (TypeScript compilation check)
4. **Test**: `npm run test` (Jest tests for React components)
5. **Build**: `npm run build` (Docusaurus production build → `build/` directory)
6. **Validate**: Check for broken links, missing images, invalid MDX

**Build Command**: `npm run build`

**Output Directory**: `website/build/`

**Code Reference**: `.github/workflows/deploy-frontend.yml`

### GitHub Actions Workflow

**File**: `.github/workflows/deploy-frontend.yml`

**Workflow Definition**:
```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm run test -- --passWithNoTests

      - name: Build Docusaurus site
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: website/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch (via GitHub UI)

**Code Reference**: `.github/workflows/deploy-frontend.yml`

### Verification Checklist

**Pre-Deployment**:
- [ ] All tests passing locally (`npm run test`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No broken links (`npx docusaurus-check-links`)
- [ ] No missing images or assets
- [ ] i18n translations up-to-date (Urdu pages match English structure)
- [ ] Environment variables configured in GitHub Secrets (if needed)

**Post-Deployment**:
- [ ] Site accessible at `https://<username>.github.io/learn-humanoid-robotics/`
- [ ] All pages load correctly (no 404s)
- [ ] Navigation works (sidebar, navbar, pagination)
- [ ] Search functionality operational
- [ ] Language toggle works (English ↔ Urdu)
- [ ] Personalization button functional (requires backend deployment)
- [ ] RAG chatbot operational (requires backend deployment)
- [ ] Responsive design on mobile/tablet
- [ ] Lighthouse scores: Performance >90, Accessibility >95, Best Practices >95, SEO >95

**Code Reference**: `.github/workflows/deploy-frontend.yml`, `website/docs/` (all content pages)

## Development Workflow

### Feature Development Process

1. **Specification** (`/sp.specify`):
   - Create detailed spec in `specs/<feature-name>/spec.md`
   - Define requirements, user stories, acceptance criteria
   - Get user approval before proceeding

2. **Planning** (`/sp.plan`):
   - Create architectural plan in `specs/<feature-name>/plan.md`
   - Define implementation strategy, dependencies, milestones
   - Identify ADR candidates (if architectural decisions made)
   - Get user approval on approach

3. **Task Generation** (`/sp.tasks`):
   - Generate actionable tasks in `specs/<feature-name>/tasks.md`
   - Break down plan into testable, atomic tasks
   - Dependency-ordered task list with acceptance criteria

4. **Implementation** (`/sp.implement`):
   - Execute tasks in order (TDD: Red → Green → Refactor)
   - Use subagents for specialized work (content generation, deployment, etc.)
   - Create PHRs for significant work sessions
   - Suggest ADRs for architectural decisions

5. **Review & Iterate**:
   - Run tests, linting, build verification
   - Get user feedback on implementation
   - Refine based on feedback

6. **Commit & PR** (`/sp.git.commit_pr`):
   - Create atomic commits with descriptive messages
   - Open PR to `develop` branch
   - CI validates changes
   - Merge after approval

### Quality Gates

**Pre-Commit**:
- All tests passing
- Linting clean (no warnings)
- Type checking passes
- No security vulnerabilities (npm audit)

**Pre-Merge to Develop**:
- PR approved by reviewer (or self-review with checklist)
- CI pipeline green
- Documentation updated (if public API changes)

**Pre-Release to Main**:
- Integration tests passing
- Manual smoke testing on staging environment
- Changelog updated
- Version bumped (semantic versioning)

### ADR Creation Triggers

Create ADR when ALL three conditions met:
1. **Impact**: Decision has long-term consequences (framework choice, data model, API design, security approach, deployment platform)
2. **Alternatives**: Multiple viable options considered with trade-offs
3. **Scope**: Cross-cutting concern influencing system design

**Suggested Command**: `/sp.adr <decision-title>`

**Example ADR Titles**:
- "001: Use Docusaurus for Static Site Generation"
- "002: RAG Architecture with Qdrant and OpenAI"
- "003: Urdu Translation Strategy (AI vs. Human Review)"
- "004: GitHub Pages for Frontend Hosting"

**Storage**: `history/adr/<number>-<slug>.md`

## Governance

### Amendment Process

**Who Can Amend**:
- Project maintainer (constitution owner)
- Community members (via PR with justification)

**Amendment Steps**:
1. Propose change with rationale (why needed, impact analysis)
2. Update constitution template placeholders or content
3. Increment version (MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
4. Update dependent templates (spec, plan, tasks) for consistency
5. Create PHR documenting amendment
6. Commit with message: `docs: amend constitution to vX.Y.Z (<brief change description>)`

### Compliance Review

**Frequency**: Every sprint/milestone (or every 2 weeks during active development)

**Checklist**:
- [ ] All code follows TDD (tests written before implementation)
- [ ] All content derived from authoritative sources (no hallucinations)
- [ ] All user data secured (auth, encryption, input validation)
- [ ] All logs structured with correlation IDs
- [ ] All APIs versioned semantically
- [ ] All PRs reference constitution principles where applicable

### Conflict Resolution

**Priority Order** (highest to lowest):
1. **Security & Privacy** (Principle VIII) - Non-negotiable
2. **Test-Driven Development** (Principle V) - Non-negotiable
3. **Content Fidelity** (Principle I) - Educational integrity
4. **Accessibility & Internationalization** (Principle IV) - Inclusivity requirement
5. Other principles (II, III, VI, VII) - Important but may have pragmatic trade-offs with justification

**Rationale**: Security and quality (TDD) cannot be compromised. Educational accuracy is core mission. Accessibility aligns with educational ethics.

### Version History

**Version**: 1.0.0
**Ratified**: 2025-12-12
**Last Amended**: 2025-12-12

**Changelog**:
- **1.0.0** (2025-12-12): Initial constitution created for Physical AI & Humanoid Robotics Textbook project. Defined 8 core principles, technology stack, multi-agent blueprint, RAG architecture, personalization system, Urdu translation workflow, and GitHub Pages deployment specification.