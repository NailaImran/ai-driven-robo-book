---
id: 0001
title: Create Physical AI Robotics Constitution
stage: constitution
date: 2025-12-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Naila Imran
command: /sp.constitution
labels: ["constitution", "textbook", "physical-ai", "robotics", "education", "docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - None (documentation artifact)
---

## Prompt

create constitution for my book "Physical AI & Humanoid Robotics " with these requirements:Target audience begnnier to intermediate,Docusourous fordoucomentation and focus on hands on learning add code snippets and diagrams where necessary guide step by step."""Hackathon I: Create a Textbook for Teaching Physical AI & Humanoid Robotics Course
The future of work will be a partnership between people, intelligent agents (AI software), and robots. This shift won't necessarily eliminate jobs but will change what humans do, leading to a massive demand for new skills. We have already written a book on AI agents. Therefore, we want you to write a textbook to teach a course in Physical AI & Humanoid Robotics (The course details are documented below).

Excel in the Hackathon and Launch Your Journey as an AI Startup Founder 🚀
We've recently launched Panaversity (panaversity.org), an initiative focused on teaching cutting-edge AI courses. Alongside this, we're working on publishing our first book, which you can explore at ai-native.panaversity.org. Our next milestone is to build a portal where authors can create AI-native technical textbooks, and readers can easily access and learn from them using AI Agents. We also plan to publish O/A Level, Science, Engineering, and Medical AI-native books to support students and professionals across disciplines. If you perform well in this hackathon, you may be invited for an interview to join the Panaversity core team and potentially step into the role of a startup founder within this growing ecosystem. You will get a chance to work with Panaversity founders Zia, Rehan, Junaid, and Wania and become the very best. You may also get a chance to teach at Panaversity, PIAIC, and GIAIC.
Requirements

You are required to complete a unified book project using Claude Code and Spec-Kit Plus. The core deliverables are:

1. AI/Spec-Driven Book Creation: Write a book using Docusaurus and deploy it to GitHub Pages. You will use Spec-Kit Plus ( https://github.com/panaversity/spec-kit-plus/ ) and Claude Code ( https://www.claude.com/product/claude-code ) to write the book.

2. Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot, utilizing the OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier, must be able to answer user questions about the book's content, including answering questions based only on text selected by the user.

3. Participants will receive points out of 100, for base functionality defined above.

4. Participants can earn up to 50 extra bonus points by creating and using reusable intelligence via Claude Code Subagents and Agent Skills in the book project.

5. Participants can receive up to 50 extra bonus points if they also implement Signup and Signin using https://www.better-auth.com/ At signup you will ask questions from the user about their software and hardware background. Knowing the background of the user we will be able to personalize the content.

6.  Participants can receive up to 50 extra bonus points if the logged user can personalise the content in the chapters by pressing a button at the start of each chapter.

7. Participants can receive up to 50 extra bonus points if the logged user can translate the content in Urdu in the chapters by pressing a button at the start of each chapter.

Timeline
Submission Deadline: Sunday, Nov 30, 2025 at 06:00 PM (form will close)
Live Presentations: Sunday, Nov 30, 2025 starting at 6:00 PM on Zoom

[Full hackathon requirements including course details for Physical AI & Humanoid Robotics: 13-week curriculum covering ROS 2, Gazebo/Unity simulation, NVIDIA Isaac, humanoid development, and conversational robotics with GPT integration. Hardware requirements include RTX GPUs, Jetson Orin Nano, RealSense cameras, and optional robot hardware (Unitree Go2/G1).]

## Response snapshot

Created comprehensive constitution v1.0.0 for Physical AI & Humanoid Robotics textbook with 7 core principles:

**I. Beginner-First Pedagogy**: All content accessible to beginner-intermediate learners; prerequisites explicit; gradual learning curves; terms defined on first use.

**II. Hands-On Implementation First**: Every concept accompanied by executable code (minimum 3 snippets per chapter); tested in ROS 2/Gazebo/Isaac; step-by-step instructions with expected outputs.

**III. Visual-First Communication**: Complex systems explained through diagrams before text; architectural diagrams mandatory; actual simulation screenshots required; mathematical concepts visualized.

**IV. Technology Stack Integrity**: Strict alignment with ROS 2 Humble/Iron, Python 3.10+, Gazebo/Unity, NVIDIA Isaac, Docusaurus; version-locked dependencies; type hints required.

**V. Incremental Complexity**: Content follows 13-week structure (Physical AI foundations → ROS 2 → Simulation → Isaac → Humanoids → Conversational robotics); no forward references; capstone uses only taught techniques.

**VI. Accessibility and Inclusivity**: Clear language for ESL learners; alt text for images; acknowledges hardware alternatives; supports future Urdu translation and personalization features.

**VII. RAG-Ready Structured Content**: Optimized for OpenAI Agents + Neon Postgres + Qdrant vector database; semantically coherent sections; consistent heading hierarchy; metadata frontmatter with keywords/prerequisites.

Additional sections cover Content Quality Standards (educational rigor, code quality, diagram standards), Development Workflow (spec-driven process using /sp.specify, /sp.plan, /sp.tasks, /sp.implement), and Governance (constitution authority, amendment process, compliance verification, conflict resolution prioritizing pedagogy over technical sophistication).

## Outcome

- ✅ Impact: Established foundational governance document defining educational philosophy, technical standards, and quality gates for textbook development. All 7 principles directly address hackathon requirements (Docusaurus delivery, hands-on learning, code snippets, diagrams, RAG optimization, accessibility/translation support).
- 🧪 Tests: No automated tests (governance document). Manual validation: all placeholders filled, no bracketed tokens remain, semantic versioning applied (0.0.0 → 1.0.0 for initial creation).
- 📁 Files: Created .specify/memory/constitution.md (207 lines); verified compatibility with existing templates (plan-template.md, spec-template.md, tasks-template.md).
- 🔁 Next prompts: Use /sp.specify to define first chapter (Week 1-2: Introduction to Physical AI); use /sp.plan to architect Docusaurus structure and RAG chatbot integration; consider /sp.adr for technology stack decisions (Docusaurus vs alternatives, RAG architecture).
- 🧠 Reflection: Constitution successfully balances educational mission (beginner accessibility, hands-on learning) with technical constraints (ROS 2, NVIDIA Isaac, RAG optimization). Principle I (Beginner-First) designated as tiebreaker for conflicts ensures pedagogical integrity. Principle VII (RAG-Ready) directly supports hackathon scoring criteria for chatbot functionality.

## Evaluation notes (flywheel)

- Failure modes observed: None. User provided comprehensive requirements including target audience, technology stack, course structure, and bonus features. No ambiguity required clarification.
- Graders run and results (PASS/FAIL): PASS - All validation checks passed: (1) No unresolved placeholders, (2) Version line matches report (1.0.0), (3) Dates in ISO format (2025-12-05), (4) Principles are declarative and testable with explicit rationale, (5) Template compatibility verified.
- Prompt variant (if applicable): Standard /sp.constitution workflow. User provided detailed context (hackathon requirements, course outline, hardware specs) enabling direct constitution creation without iterative clarification.
- Next experiment (smallest change to try): After first chapter implementation, validate whether Principle II (minimum 3 code snippets per chapter) is sufficient or if adjustment needed based on ROS 2 complexity. May need to refine code quality standards to address simulation environment setup overhead.
