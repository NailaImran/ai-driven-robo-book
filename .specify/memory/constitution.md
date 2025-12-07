<!--
Sync Impact Report:
- Version: 0.0.0 → 1.0.0
- Change Type: Initial constitution creation
- Principles Added: 7 core principles for educational textbook development
- Sections Added: Core Principles, Content Quality Standards, Development Workflow, Governance
- Templates Status:
  ✅ plan-template.md: Compatible (Constitution Check references valid)
  ✅ spec-template.md: Compatible (User story structure supports educational scenarios)
  ✅ tasks-template.md: Compatible (Task organization supports content development)
- Follow-up TODOs: None (all fields filled)
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Beginner-First Pedagogy

Every chapter, code example, and concept MUST be accessible to learners with beginner to intermediate programming and robotics knowledge. Complex topics MUST be scaffolded progressively, starting with fundamental concepts before advancing to sophisticated implementations.

**Non-Negotiable Rules**:
- No assumed knowledge beyond basic Python programming and elementary mathematics
- Every technical term MUST be defined on first use with clear, jargon-free explanations
- Prerequisites MUST be explicitly stated at the beginning of each chapter
- Learning curves MUST be gradual; introduce one new concept per section maximum

**Rationale**: The target audience ranges from complete robotics beginners to intermediate practitioners. Inaccessible content fails the educational mission and excludes learners who could benefit most.

### II. Hands-On Implementation First

Every theoretical concept MUST be accompanied by executable code examples, practical exercises, and real-world applications. Documentation serves implementation, never the reverse.

**Non-Negotiable Rules**:
- Every chapter MUST include at least three working code snippets that readers can run
- All code examples MUST be tested in ROS 2 Humble/Iron, Gazebo, or NVIDIA Isaac Sim environments
- Step-by-step instructions MUST accompany every hands-on exercise with expected outputs
- Code MUST be minimal viable examples (avoid production boilerplate that obscures learning)

**Rationale**: Physical AI requires experiential learning. Passive reading without doing fails to develop the practical skills needed for robotics development. This textbook prepares practitioners, not theorists.

### III. Visual-First Communication

Complex systems, architectures, sensor data flows, and robot kinematics MUST be explained through diagrams, visualizations, and annotated screenshots before textual descriptions.

**Non-Negotiable Rules**:
- Every module MUST include architectural diagrams showing system components and data flow
- Robot simulation screenshots MUST show actual Gazebo/Isaac Sim interfaces, not abstract representations
- Mathematical concepts (kinematics, transforms) MUST include visual representations alongside equations
- Minimum one diagram per major concept; text alone is insufficient for spatial/systems thinking

**Rationale**: Physical AI involves 3D spatial reasoning, sensor fusion, and complex system architectures that are inherently visual. Text-only explanations fail to convey the physical reality learners must understand.

### IV. Technology Stack Integrity

The textbook MUST maintain strict alignment with the specified technology stack: ROS 2 (Humble/Iron), Python 3.10+, Gazebo/Unity for simulation, NVIDIA Isaac for perception, and Docusaurus for delivery.

**Non-Negotiable Rules**:
- All code examples MUST target ROS 2 Humble or Iron (no ROS 1 content)
- Python code MUST use type hints and follow PEP 8 conventions
- Third-party libraries MUST be justified and listed with exact version constraints
- Docusaurus content MUST be MDX-compatible with proper frontmatter metadata

**Rationale**: Version drift and inconsistent tooling create confusion and broken examples. Students need a coherent, tested technology foundation that matches the course hardware requirements (RTX GPUs, Jetson, RealSense cameras).

### V. Incremental Complexity

Content MUST follow the documented weekly structure: Physical AI foundations (Weeks 1-2) → ROS 2 fundamentals (Weeks 3-5) → Simulation (Weeks 6-7) → NVIDIA Isaac (Weeks 8-10) → Humanoid development (Weeks 11-12) → Conversational robotics (Week 13).

**Non-Negotiable Rules**:
- No Week 8 concept may appear before Week 7 content is complete
- Each week MUST build only on prior weeks; no forward references to未covered material
- Capstone project (Autonomous Humanoid) MUST only use techniques taught in Weeks 1-12
- Cross-references MUST link to already-covered content or clearly flag prerequisites

**Rationale**: The course is structured as a dependency graph. Violating the order breaks the learning progression and leaves students unable to complete exercises due to missing foundational knowledge.

### VI. Accessibility and Inclusivity

Content MUST be accessible to diverse learners, including those for whom English is a second language, learners with disabilities, and students with varying hardware constraints.

**Non-Negotiable Rules**:
- Writing MUST use clear, direct language; avoid idioms and culturally-specific references
- All images MUST have descriptive alt text for screen readers
- Code blocks MUST have syntax highlighting and clear language tags
- Content MUST acknowledge hardware alternatives (cloud-based Isaac Sim, lighter simulation options)
- Future requirement: Support for Urdu translation and content personalization per hackathon bonus features

**Rationale**: Panaversity's mission is global AI education. Exclusive or inaccessible content contradicts this mission and unnecessarily limits the reach and impact of the textbook.

### VII. RAG-Ready Structured Content

All content MUST be structured to optimize retrieval-augmented generation (RAG) for the embedded chatbot using OpenAI Agents, Neon Postgres, and Qdrant vector database.

**Non-Negotiable Rules**:
- Each section MUST be semantically coherent and self-contained for vector embedding
- Headings MUST use consistent hierarchy (H1 for chapters, H2 for modules, H3 for concepts)
- Code blocks MUST include descriptive comments for context extraction
- Key concepts MUST be explicitly defined in glossary-style format for entity extraction
- Metadata frontmatter MUST include keywords, learning objectives, and prerequisite tags

**Rationale**: The hackathon requires an embedded RAG chatbot that answers questions about book content, including selected text. Poor content structure degrades retrieval accuracy and chatbot usefulness, directly impacting project scoring.

## Content Quality Standards

### Educational Rigor

All technical content MUST be accurate, current (as of 2025), and verified against official documentation:
- ROS 2 content verified against docs.ros.org
- NVIDIA Isaac content verified against docs.omniverse.nvidia.com
- Hardware specifications verified against manufacturer datasheets

### Code Quality

All code examples MUST:
- Run without errors in the specified environment
- Include error handling appropriate to educational context (demonstrate concepts, not production robustness)
- Use meaningful variable names and include explanatory comments
- Provide expected output or behavior description

### Diagram Standards

All diagrams MUST:
- Use consistent visual language (icons, colors, shapes)
- Include legends for non-obvious symbols
- Be readable at default Docusaurus rendering size
- Be exportable as SVG or high-resolution PNG (minimum 1920px width)

## Development Workflow

### Content Creation Process

1. **Spec-Driven Development**: Use `/sp.specify` to define chapter scope, learning objectives, and acceptance criteria
2. **Planning**: Use `/sp.plan` to architect content structure, identify dependencies, determine diagram needs
3. **Task Decomposition**: Use `/sp.tasks` to break chapters into discrete writing/coding tasks
4. **Implementation**: Use `/sp.implement` to execute task list with continuous validation
5. **Review**: Validate against Constitution Check before considering chapter complete

### Testing Requirements

- All code snippets MUST be validated by copy-paste execution in target environment
- All links MUST be tested (no broken internal/external references)
- All diagrams MUST render correctly in Docusaurus build
- Chatbot MUST successfully retrieve relevant content when queried about chapter topics

### Version Control

- Commit granularity: per completed section or logical content unit
- Commit messages MUST reference chapter/week number (e.g., "docs: add Week 3 ROS 2 nodes section")
- Never commit untested code examples
- Use feature branches for major chapters (e.g., `week-03-ros2-fundamentals`)

### Documentation Standards

- README.md MUST include setup instructions for development environment
- CONTRIBUTING.md MUST document content creation workflow and style guide
- Each chapter MUST include estimated completion time for students
- Capstone project MUST include detailed rubric and submission guidelines

## Governance

### Constitution Authority

This constitution supersedes all other development practices and preferences. Any deviation MUST be explicitly justified as a documented exception with rationale.

### Amendment Process

1. Propose amendment via GitHub issue with rationale and impact analysis
2. Demonstrate how amendment improves educational outcomes or project feasibility
3. Update constitution with incremented version number (semantic versioning)
4. Propagate changes to all dependent templates and documentation
5. Record decision in Architecture Decision Record (ADR) if architecturally significant

### Compliance Verification

- All pull requests MUST pass Constitution Check in implementation plan
- Code reviews MUST verify adherence to pedagogy principles (I-II)
- Content reviews MUST verify visual standards (III) and accessibility (VI)
- CI/CD pipeline MUST validate code snippet executability (II) and RAG structure (VII)

### Conflict Resolution

When principles conflict (e.g., code simplicity vs. production best practices):
1. **Beginner-First Pedagogy (I) always wins** over technical sophistication
2. **Hands-On Implementation (II) wins** over theoretical completeness
3. **Visual-First (III) wins** over text economy
4. Document the tradeoff in chapter notes if significant

### Complexity Budget

Unjustified complexity is prohibited:
- No design patterns unless essential to understanding robot architecture
- No premature optimization; prefer clear code over fast code in examples
- No framework abstractions unless they're industry-standard in robotics (ROS 2 patterns acceptable)
- Burden of proof is on complexity introducer to justify educational value

### Use of AI Development Tools

This textbook is created using Claude Code with Spec-Kit Plus methodology:
- All specifications MUST use `/sp.specify` command
- All architectural decisions MUST use `/sp.plan` command
- All task breakdowns MUST use `/sp.tasks` command
- Significant architectural decisions MUST be captured via `/sp.adr` command
- All user interactions MUST generate Prompt History Records (PHRs) automatically

**Version**: 1.0.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05
