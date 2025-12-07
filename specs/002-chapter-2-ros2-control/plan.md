# Implementation Plan: Chapter 2 - The Robotic Nervous System

**Branch**: `001-physical-ai-textbook` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-chapter-2-ros2-control/spec.md`

## Summary

Chapter 2 teaches students ROS 2 architecture, URDF robot modeling, control theory (PID, ZMP), and edge deployment. The chapter includes 4 interactive web components (Node Visualizer, URDF Editor, PID Tuner, Deployment Dashboard) integrated into Docusaurus MDX lessons. Students progress from ROS 2 installation through autonomous balance control, validated by quizzes, coding assignments, and a capstone project.

**Technical Approach**: Build React-based interactive components using Three.js (3D visualization), D3.js (graph layouts), WebSocket (real-time data), and integrate with existing AuthContext for progress tracking. Content authored in MDX with embedded components, code examples tested in ROS 2 Humble environment.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x + React 18.x (Docusaurus 3.x)
- Backend Services: Python 3.10+ (ROS 2 Humble nodes, rosbridge_suite)
- Code Examples: Python 3.10+ and C++ 17 (ROS 2 standards)

**Primary Dependencies**:
- **ROS 2 Humble**: Core middleware and CLI tools
- **Docusaurus 3.9.2**: Static site generator with MDX support
- **Three.js 0.150+**: WebGL 3D rendering for URDF Editor
- **D3.js 7.x**: Force-directed graphs for Node Visualizer
- **Recharts 2.x**: Real-time plotting for PID Tuner
- **Socket.IO / rosbridge_suite**: WebSocket bridge for ROS 2 real-time data
- **Monaco Editor**: Code editor for URDF editing
- **React Hook Form**: Form state for interactive components

**Storage**:
- **LocalStorage**: User progress, quiz scores, code submissions (via AuthContext)
- **Static Assets**: URDF meshes, diagrams, code examples (served by Docusaurus)
- **Future**: Neon Postgres + Qdrant for RAG chatbot indexing

**Testing**:
- **Jest + React Testing Library**: Unit tests for React components
- **Playwright**: E2E tests for interactive workflows
- **ROS 2 Test Framework**: Validation of all Python/C++ code examples
- **URDF Validators**: check_urdf tool for model validation

**Target Platform**:
- **Primary**: Chrome 90+, Firefox 88+, Safari 14+ (desktop browsers)
- **Secondary**: Mobile browsers (responsive design, degraded 3D performance acceptable)
- **Development Environment**: Ubuntu 22.04 (ROS 2 Humble native)

**Project Type**: Web application (Docusaurus frontend + optional backend services for real-time features)

**Performance Goals**:
- Interactive components render at 30+ fps (60 fps target for 3D)
- URDF Editor handles models with 100+ links in <2 seconds
- Node Visualizer supports 50+ nodes without degradation
- Page load time <3 seconds on 10 Mbps connection
- WebSocket latency <100ms for real-time updates

**Constraints**:
- ROS 2 Humble only (no backward compatibility with ROS 1)
- Ubuntu 22.04 required for code examples (Docker acceptable)
- All code must work with 4GB RAM minimum
- Total chapter assets <500MB (meshes, videos, diagrams)
- No paid dependencies (free/open-source only)

**Scale/Scope**:
- 4 lessons (8-12 hours total study time)
- 40+ code examples (Python/C++ pairs)
- 4 interactive components (3000+ LOC total)
- 40 quiz questions (10 per lesson)
- 4 practical assignments + 1 capstone project
- 15+ diagrams/visualizations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Beginner-First Pedagogy
- **Compliance**: Specification defines progressive learning objectives starting with ROS 2 basics before control theory
- **Evidence**: Each lesson builds on prior (2.1 → 2.2 → 2.3 → 2.4), prerequisites explicitly stated
- **Validation**: No assumed knowledge beyond Chapter 1 (sensors, actuators, Linux basics)

### ✅ II. Hands-On Implementation First
- **Compliance**: 40+ executable code examples, all lessons include 60-90 min hands-on coding time
- **Evidence**: FR-C2-003 requires all code works in ROS 2 Humble, FR-C2-004 provides Python + C++ versions
- **Validation**: Practical assignments auto-graded via unit tests (FR-C2-018)

### ✅ III. Visual-First Communication
- **Compliance**: FR-C2-005 mandates 3+ diagrams per lesson, interactive 3D/graph components for complex concepts
- **Evidence**: Node Visualizer (ROS 2 architecture), URDF Editor (3D kinematics), PID Tuner (step response graphs)
- **Validation**: All diagrams have alt text (FR-C2-028), wireframes provided in spec

### ✅ IV. Technology Stack Integrity
- **Compliance**: ROS 2 Humble target, Python 3.10+, Docusaurus 3.x, all specified in requirements
- **Evidence**: FR-C2-003 (ROS 2 Humble only), NFR-C2-002 (ROS 2 naming conventions)
- **Validation**: Version constraints in package.json and requirements.txt

### ✅ V. Incremental Complexity
- **Compliance**: Chapter 2 follows Chapter 1, lessons ordered 2.1 → 2.2 → 2.3 → 2.4 with dependencies
- **Evidence**: Lesson 2.2 needs ROS 2 CLI from 2.1, Lesson 2.3 needs URDF from 2.2
- **Validation**: Prerequisites checked in acceptance scenarios (spec lines 42-46)

### ✅ VI. Accessibility and Inclusivity
- **Compliance**: FR-C2-028 (alt text), FR-C2-029 (syntax highlighting), FR-C2-030 (keyboard navigation)
- **Evidence**: Cloud alternatives for Jetson (edge case 3), mobile-responsive design (FR-C2-013)
- **Validation**: WCAG 2.1 AA standards (SC-C2-010)

### ✅ VII. RAG-Ready Structured Content
- **Compliance**: MDX frontmatter with keywords, learning objectives, consistent H1-H3 hierarchy
- **Evidence**: Content outline uses proper heading structure (spec lines 567-835)
- **Validation**: FR-C2-022 requires RAG chatbot trained on ROS 2 docs, structured for vector embedding

**Gate Result**: ✅ PASS - All principles satisfied without violations

## Project Structure

### Documentation (this feature)

```text
specs/002-chapter-2-ros2-control/
├── spec.md              # ✅ Created (5000+ words, comprehensive)
├── plan.md              # ← This file (implementation architecture)
├── research.md          # Phase 0 output (technology decisions, alternatives)
├── data-model.md        # Phase 1 output (entities, relationships)
├── quickstart.md        # Phase 1 output (developer onboarding)
├── contracts/           # Phase 1 output (API specs for interactive components)
│   ├── node-visualizer-api.yaml
│   ├── urdf-editor-api.yaml
│   ├── pid-tuner-api.yaml
│   └── deployment-api.yaml
└── tasks.md             # Phase 2 output (created by /sp.tasks, NOT by /sp.plan)
```

### Source Code (repository root)

```text
physical-ai-textbook/
├── docs/
│   └── chapter-2/                        # Chapter 2 content
│       ├── chapter-2-index.md            # Chapter landing page
│       ├── lesson-2-1-ros2-fundamentals.md
│       ├── lesson-2-2-urdf-modeling.md
│       ├── lesson-2-3-control-theory.md
│       ├── lesson-2-4-deployment.md
│       ├── quiz-2-1.md                   # Embedded quiz components
│       ├── quiz-2-2.md
│       ├── quiz-2-3.md
│       ├── quiz-2-4.md
│       └── assets/                       # Diagrams, URDF files, meshes
│           ├── diagrams/
│           ├── code-examples/            # Python/C++ snippets
│           ├── urdf-models/
│           └── meshes/
│
├── src/
│   ├── components/
│   │   ├── chapter-2/                    # Chapter 2 interactive components
│   │   │   ├── NodeVisualizer/
│   │   │   │   ├── NodeVisualizer.tsx
│   │   │   │   ├── NodeVisualizer.module.css
│   │   │   │   ├── GraphLayout.ts        # D3.js force-directed graph
│   │   │   │   ├── TopicStream.tsx       # Real-time message flow
│   │   │   │   └── MessageInjector.tsx   # Test message publisher
│   │   │   ├── URDFEditor/
│   │   │   │   ├── URDFEditor.tsx
│   │   │   │   ├── URDFEditor.module.css
│   │   │   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   │   │   ├── ThreeViewer.tsx       # Three.js 3D preview
│   │   │   │   ├── URDFParser.ts         # XML → JSON transform
│   │   │   │   ├── JointSliders.tsx      # Interactive joint control
│   │   │   │   └── TemplateLibrary.tsx   # Preset URDF models
│   │   │   ├── PIDTuner/
│   │   │   │   ├── PIDTuner.tsx
│   │   │   │   ├── PIDTuner.module.css
│   │   │   │   ├── ParameterSliders.tsx  # Kp, Ki, Kd controls
│   │   │   │   ├── StepResponseGraph.tsx # Recharts visualization
│   │   │   │   ├── PIDSimulator.ts       # Client-side simulation
│   │   │   │   └── PerformanceMetrics.tsx# Rise time, overshoot, settling
│   │   │   └── DeploymentDashboard/
│   │   │       ├── DeploymentDashboard.tsx
│   │   │       ├── DeploymentDashboard.module.css
│   │   │       ├── HardwareStatus.tsx    # Jetson connection monitor
│   │   │       ├── SystemMetrics.tsx     # CPU/RAM/Network graphs
│   │   │       ├── NodeManager.tsx       # ROS 2 node list + restart
│   │   │       ├── LogViewer.tsx         # Filterable log display
│   │   │       └── CodeUploader.tsx      # Deploy new packages
│   │   │
│   │   └── shared/                       # Reusable from Chapter 1
│   │       ├── Auth/                     # UserMenu, Login, Signup
│   │       └── PersonalizationToggle.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx               # Existing (reused)
│   │
│   └── hooks/
│       ├── useROS2Bridge.ts              # WebSocket connection to rosbridge
│       ├── useURDFValidator.ts           # URDF syntax validation
│       └── usePIDSimulation.ts           # Real-time PID computation
│
├── backend/                              # Optional backend services
│   ├── rosbridge/                        # ROS 2 WebSocket bridge
│   │   └── launch/
│   │       └── rosbridge_websocket.launch.py
│   ├── urdf-validator/                   # URDF validation service
│   │   ├── validator.py                  # check_urdf wrapper
│   │   └── api.py                        # FastAPI endpoints
│   └── deployment-agent/                 # Runs on Jetson
│       ├── metrics_publisher.py          # System stats → WebSocket
│       └── code_deployer.py              # Receive/install packages
│
├── tests/
│   ├── components/
│   │   └── chapter-2/                    # Jest + RTL tests
│   │       ├── NodeVisualizer.test.tsx
│   │       ├── URDFEditor.test.tsx
│   │       ├── PIDTuner.test.tsx
│   │       └── DeploymentDashboard.test.tsx
│   ├── e2e/
│   │   └── chapter-2-workflows.spec.ts   # Playwright E2E tests
│   └── ros2/
│       ├── test_code_examples.py         # Validate all ROS 2 snippets
│       └── test_urdf_models.py           # check_urdf on all models
│
└── i18n/
    └── ur/
        └── docusaurus-plugin-content-docs/
            └── current/
                └── chapter-2/            # Urdu translations (future)
```

**Structure Decision**: Web application structure chosen because:
1. Docusaurus frontend hosts MDX content + React components
2. Optional backend services provide real-time features (rosbridge WebSocket, URDF validation API)
3. Deployment agent runs separately on Jetson hardware (not part of main repo)
4. All interactive components are self-contained React modules in `src/components/chapter-2/`

## Complexity Tracking

> **No violations detected** - Constitution Check passed without needing complexity justifications.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

**RT-C2-001: ROS 2 WebSocket Bridge Options**
- **Question**: Which ROS 2-to-WebSocket solution for Node Visualizer and Deployment Dashboard?
- **Options**:
  1. rosbridge_suite (official, WebSocket + JSON)
  2. roslibjs (client-side library)
  3. Custom FastAPI bridge
- **Decision Criteria**: Maturity, ROS 2 Humble compatibility, WebSocket performance, community support

**RT-C2-002: 3D Rendering Library for URDF Editor**
- **Question**: Best approach for web-based 3D URDF visualization?
- **Options**:
  1. Three.js (WebGL, widely used)
  2. Babylon.js (advanced physics)
  3. React-Three-Fiber (React bindings for Three.js)
- **Decision Criteria**: URDF mesh format support (STL/DAE/OBJ), performance with 100+ links, React integration

**RT-C2-003: Graph Layout Algorithm for Node Visualizer**
- **Question**: How to lay out ROS 2 node graphs interactively?
- **Options**:
  1. D3.js force-directed layout
  2. Cytoscape.js (graph library)
  3. ELK.js (Eclipse Layout Kernel)
- **Decision Criteria**: Real-time performance with 50+ nodes, customization for ROS 2 patterns, drag-and-drop support

**RT-C2-004: PID Simulation Approach**
- **Question**: Client-side or server-side PID simulation?
- **Options**:
  1. Client-side JavaScript (immediate feedback)
  2. Server-side Python (accurate physics)
  3. Hybrid (simple models client, complex server)
- **Decision Criteria**: Response latency, simulation accuracy for educational purposes, server load

**RT-C2-005: Code Example Testing Strategy**
- **Question**: How to ensure all 40+ code examples remain valid?
- **Options**:
  1. Manual testing per release
  2. Automated ROS 2 test framework in CI/CD
  3. Docker-based isolated test environments
- **Decision Criteria**: CI/CD feasibility, test isolation, maintenance overhead

**RT-C2-006: URDF Validation Method**
- **Question**: How to validate URDF syntax in web editor?
- **Options**:
  1. Client-side XML parser (fast, limited)
  2. Server-side check_urdf tool (accurate, requires backend)
  3. JavaScript port of URDF schema (moderate effort)
- **Decision Criteria**: Validation accuracy, response time, deployment complexity

**RT-C2-007: Deployment Dashboard Communication**
- **Question**: How to connect dashboard to remote Jetson?
- **Options**:
  1. WebSocket over SSH tunnel
  2. MQTT broker
  3. Direct WebSocket (requires network config)
- **Decision Criteria**: Security, firewall compatibility, real-time performance

**Output**: `research.md` with decisions, rationale, and rejected alternatives for each research task.

---

## Phase 1: Design & Contracts

### Data Model Design

Extract entities from spec and define schemas:

**Entities to Model**:
1. **Lesson** (id, title, readingTime, codingTime, content, diagrams[], codeExamples[], quiz)
2. **CodeExample** (id, language, code, description, dependencies[], testCases[])
3. **URDFModel** (id, name, xmlContent, meshes[], joints[], links[])
4. **ControlAlgorithm** (id, type, parameters{}, implementation, simulationConfig{})
5. **Quiz** (id, questions[], passingScore, timeLimit, attempts)
6. **Assessment** (id, type, userSubmission, rubric, score, autoGraded)
7. **HardwareProfile** (id, platform, specs{}, deploymentTarget)

**Output**: `data-model.md` with entity schemas, relationships, validation rules, state transitions

### API Contracts

Generate OpenAPI/REST specs for interactive components:

**AC-C2-001: Node Visualizer API** (`contracts/node-visualizer-api.yaml`)
```yaml
paths:
  /api/ros2/nodes:
    get:
      summary: List all active ROS 2 nodes
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    name: string
                    namespace: string
                    subscribers: array
                    publishers: array

  /api/ros2/topics:
    get:
      summary: List all topics with metadata

  /ws/ros2/graph:
    websocket:
      summary: Real-time node/topic updates
      messages:
        node_added: {...}
        topic_message: {...}

  /api/ros2/publish:
    post:
      summary: Inject test message into topic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              topic: string
              message: object
```

**AC-C2-002: URDF Editor API** (`contracts/urdf-editor-api.yaml`)
```yaml
paths:
  /api/urdf/validate:
    post:
      summary: Validate URDF XML syntax
      requestBody:
        content:
          text/xml:
            schema:
              type: string
      responses:
        200:
          content:
            application/json:
              schema:
                valid: boolean
                errors: array

  /api/urdf/parse:
    post:
      summary: Parse URDF to JSON for 3D rendering
      responses:
        200:
          content:
            application/json:
              schema:
                links: array
                joints: array

  /api/urdf/templates:
    get:
      summary: List preset URDF models
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  id: string
                  name: string
                  description: string
                  urdf: string
```

**AC-C2-003: PID Tuner API** (Optional - client-side simulation preferred)
```yaml
# NO BACKEND REQUIRED - Pure client-side simulation
# PIDSimulator.ts handles all computation in browser
```

**AC-C2-004: Deployment Dashboard API** (`contracts/deployment-api.yaml`)
```yaml
paths:
  /ws/deployment/status:
    websocket:
      summary: Real-time hardware status updates
      messages:
        hardware_status: {jetson: {connected: bool, ip: string}, sensors: {...}}
        system_metrics: {cpu: float, ram: float, network: {...}}
        node_status: {nodes: [{name: string, state: string}]}

  /api/deployment/upload:
    post:
      summary: Upload and deploy ROS 2 package
      requestBody:
        content:
          multipart/form-data:
            schema:
              package: binary

  /api/deployment/restart:
    post:
      summary: Restart specific ROS 2 node
      requestBody:
        content:
          application/json:
            schema:
              node_name: string

  /api/deployment/logs:
    get:
      summary: Fetch logs with filtering
      parameters:
        - name: level
          in: query
          schema:
            type: string
            enum: [info, warn, error]
        - name: limit
          in: query
          schema:
            type: integer
```

### Developer Quickstart

**Output**: `quickstart.md` with:
1. Prerequisites (Ubuntu 22.04, ROS 2 Humble, Node.js 18+, Docker)
2. Repository setup (`git clone`, `npm install`, ROS 2 workspace setup)
3. Running development environment (Docusaurus dev server, rosbridge launch)
4. Testing code examples (pytest for ROS 2, Jest for React components)
5. Building and deploying (production build, static hosting)

---

## Phase 2: Implementation Phases (High-Level)

> **Note**: Detailed task breakdown created by `/sp.tasks` command, not this plan.

### Phase 2.1: Content Authoring (Lessons 2.1-2.4)

**Estimated Effort**: 4-5 days
- Write MDX files for 4 lessons with embedded diagrams
- Create 40+ Python/C++ code examples
- Test all code in ROS 2 Humble environment
- Generate 15+ diagrams (architecture, flowcharts, kinematics)

### Phase 2.2: Interactive Components Development

**Estimated Effort**: 7-9 days
- **Day 1-2**: Node Visualizer (D3.js graph, WebSocket integration)
- **Day 3-4**: URDF Editor (Monaco + Three.js, URDF parser)
- **Day 5-6**: PID Tuner (Recharts, client-side simulation)
- **Day 7-8**: Deployment Dashboard (WebSocket, SSH integration)
- **Day 9**: Integration testing and bug fixes

### Phase 2.3: Assessment System

**Estimated Effort**: 2-3 days
- Create 40 quiz questions with explanations
- Implement quiz components with immediate feedback
- Design assignment auto-grading framework
- Create capstone project rubric and test suite

### Phase 2.4: Integration & Testing

**Estimated Effort**: 3-4 days
- Integrate components into lesson MDX files
- Connect AuthContext for progress tracking
- E2E testing with Playwright
- Performance optimization (3D rendering, WebSocket latency)
- Accessibility audit (WCAG 2.1 AA)

### Phase 2.5: Documentation & Deployment

**Estimated Effort**: 1-2 days
- Update README with Chapter 2 setup instructions
- Create URDF mesh asset library
- Deploy to staging environment
- User acceptance testing

---

## Key Technical Decisions

### Decision 1: Client-Side PID Simulation
**Choice**: Implement PID tuner with pure JavaScript simulation (no backend)
**Rationale**:
- Educational PID examples are simple enough for client-side (no complex physics)
- Eliminates server latency, provides instant feedback
- Reduces deployment complexity
**Trade-off**: Limited to basic transfer functions, cannot simulate full robot dynamics

### Decision 2: rosbridge_suite for ROS 2 Bridge
**Choice**: Use official rosbridge_suite WebSocket bridge
**Rationale**:
- Official ROS 2 package, well-maintained
- JSON serialization suitable for web browsers
- Supports topics, services, actions
**Trade-off**: Adds dependency on rosbridge server running alongside Docusaurus

### Decision 3: Three.js for URDF Visualization
**Choice**: Use Three.js directly (not React-Three-Fiber)
**Rationale**:
- Lower-level control for custom URDF rendering
- Better performance with 100+ link models
- No React reconciliation overhead
**Trade-off**: More imperative code, manual lifecycle management

### Decision 4: Monaco Editor for URDF Editing
**Choice**: Use Monaco (VS Code editor) for XML editing
**Rationale**:
- Excellent syntax highlighting and autocomplete
- Familiar to developers
- Supports custom language definitions
**Trade-off**: Large bundle size (~2MB), mitigated by code splitting

### Decision 5: Docker for Code Example Testing
**Choice**: Use Docker containers in CI/CD for ROS 2 code validation
**Rationale**:
- Isolated ROS 2 Humble environment
- Reproducible across development machines
- Prevents version drift
**Trade-off**: Slower CI/CD, requires Docker infrastructure

---

## Risk Mitigation

### Risk 1: WebSocket Connection Failures
**Mitigation**:
- Implement automatic reconnection with exponential backoff
- Display clear error messages with troubleshooting steps
- Provide offline mode for PID Tuner and URDF Editor (no backend required)

### Risk 2: 3D Performance on Low-End Devices
**Mitigation**:
- Implement Level of Detail (LOD) for URDF meshes
- Detect WebGL support and show 2D fallback
- Provide performance mode toggle (reduce lighting/shadows)

### Risk 3: ROS 2 Installation Complexity
**Mitigation**:
- Provide Docker-based ROS 2 environment (no local install)
- Cloud-based alternative (NVIDIA Isaac Sim free tier)
- Detailed troubleshooting guide for common errors

### Risk 4: Code Example Bit Rot
**Mitigation**:
- Automated testing in CI/CD pipeline
- Pin exact ROS 2 Humble version in Dockerfile
- Quarterly maintenance review of examples

### Risk 5: URDF Editor Complexity
**Mitigation**:
- Provide template library (biped, quadruped, arm)
- Implement visual error highlighting
- Include tutorial walkthrough for first use

---

## Success Metrics

### Educational Metrics
- 85% lesson completion rate (tracked via AuthContext)
- Average quiz score ≥75% across all 4 lessons
- 80% of students deploy code successfully (or pass simulation test)

### Technical Metrics
- Node Visualizer: 50+ nodes at 30 fps
- URDF Editor: 100-link models in <2 seconds
- PID Tuner: <100ms graph update latency
- Deployment Dashboard: <5 second connection time
- All components: WCAG 2.1 AA compliance

### Engagement Metrics
- Interactive component usage: 90% of students use at least 3 of 4 components
- Code example fork rate: 100+ stars on GitHub
- Peer review participation: 60% of capstone submissions reviewed

---

## Next Steps

1. ✅ **Specification Complete** (`spec.md` created)
2. ✅ **Implementation Plan Complete** (this file)
3. ⏭️ **Run `/sp.tasks`** to generate detailed task breakdown
4. 🔄 **Phase 0 Execution**: Create `research.md` with technology decisions
5. 🔄 **Phase 1 Execution**: Create `data-model.md`, `contracts/`, `quickstart.md`
6. 🔄 **Phase 2 Execution**: Implement tasks from `tasks.md`

---

**Plan Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Ready for Task Generation (`/sp.tasks`)
