# Implementation Plan: Chapter 3 - Simulation & Digital Twins

**Branch**: `001-chapter-3-simulation` | **Date**: 2025-12-07 | **Spec**: [Chapter 3 Specification](spec.md)
**Input**: Feature specification from `/specs/001-chapter-3-simulation/spec.md`

**Note**: This plan maps 5 user stories across 4 lessons with 14 hours of hands-on content and 12 executable code examples.

## Summary

**Primary Goal**: Enable students to simulate humanoid robots across multiple platforms (Gazebo, Unity, Isaac Sim) with realistic sensor outputs and synthetic data generation, preparing them for Chapter 4 VLM integration and Chapter 11-12 real robot deployment.

**Technical Approach**:
1. **Foundation** (Lessons 3.1–3.3): Build progressively from physics-based simulation (Gazebo) → high-fidelity rendering (Unity/Isaac) → photorealistic environments
2. **Sensors & Data** (Lesson 3.4): Layer sensor simulation and synthetic data generation on top of configured scenes
3. **Integration**: Connect Chapter 2 URDF models → simulate → generate datasets → feed into Chapter 4 VLMs
4. **Hands-On**: 12 runnable examples (3 per lesson) + 4 interactive components (world builder, scene viewer, task designer, point cloud visualizer)

## Technical Context

**Language/Version**: Python 3.10+, ROS 2 Humble/Iron (aligned with Chapter 2)
**Primary Dependencies**:
- Gazebo Garden (physics simulation, sensor plugins)
- NVIDIA Isaac Sim (photorealistic rendering, synthetic data export)
- Unity Robotics Hub + ROS-TCP-Connector (rendering bridge)
- ROS 2 client library (rclpy)
- OpenCV (sensor data processing)

**Storage**: File-based (SDF world files, URDF models, synthetic image datasets in COCO/YOLO format)
**Testing**: ROS 2 bag files for sensor data validation, simulation traces for physics verification, image inspection for synthetic data quality
**Target Platform**: Ubuntu 22.04 (Linux), RTX GPU preferred for Isaac Sim (cloud fallback available via Omniverse)
**Project Type**: Educational textbook chapter (content-heavy, hands-on code examples, interactive components)
**Performance Goals**:
- Gazebo simulation: 10+ DOF robot stable for 60+ seconds
- Sensor latency: <50ms from command to sensor output
- Synthetic data generation: 1000+ annotated images per run
- Code examples: 90% execute without modification on copy-paste

**Constraints**:
- ROS 2 Humble/Iron only (no ROS 1)
- Beginner-friendly code (no advanced OOP patterns)
- 2-week delivery (Weeks 6-7) / ~12-14 hours student effort
- Hardware alternatives documented (cloud Isaac, lightweight Gazebo)

**Scale/Scope**:
- 4 lessons × 3 hours average = 12 hours core content
- 12 code examples (3 per lesson)
- 8 diagrams (2 per lesson)
- 4 interactive web components
- ~40-50 pages Docusaurus content (MDX-formatted, RAG-optimized)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I: Beginner-First Pedagogy**
- ✅ **PASS**: All code examples use Python 3.10+ basics only; concepts introduced incrementally (Gazebo → Unity → Isaac → Sensors)
- ✅ **PASS**: Every technical term (SDF, URDF, physics timestep, PBR) defined on first use in lesson content

**Principle II: Hands-On Implementation First**
- ✅ **PASS**: 12 code examples across 4 lessons (3 per lesson), each copy-paste executable
- ✅ **PASS**: All examples tested in ROS 2 Humble + Gazebo/Isaac environments before publication
- ✅ **PASS**: Step-by-step tutorials with expected outputs for each lesson

**Principle III: Visual-First Communication**
- ✅ **PASS**: 8 diagrams planned (2 per lesson): Gazebo architecture, physics pipeline, rendering flow, Isaac Sim overview, sensor architectures, data pipelines
- ✅ **PASS**: Actual Gazebo/Isaac Sim interface screenshots (not abstract diagrams) for visualization
- ✅ **PASS**: Mathematical concepts (transforms, sensor frames) include visual representations

**Principle IV: Technology Stack Integrity**
- ✅ **PASS**: ROS 2 Humble/Iron only (no ROS 1)
- ✅ **PASS**: Python 3.10+ with type hints and PEP 8
- ✅ **PASS**: Gazebo Garden, Isaac Sim (exact versions to be specified in research.md)
- ✅ **PASS**: Docusaurus MDX format with YAML frontmatter for RAG optimization

**Principle V: Incremental Complexity**
- ✅ **PASS**: Chapter 3 depends only on Chapter 2 (URDF, ROS 2 basics); no Week 8+ concepts introduced
- ✅ **PASS**: Lesson sequence: Gazebo (foundation) → Rendering (visualization) → Isaac (advanced) → Sensors (integration)
- ✅ **PASS**: All exercises use Chapter 2 models; cross-references point backward or flag prerequisites

**Principle VI: Accessibility and Inclusivity**
- ✅ **PASS**: Clear, direct language avoiding idioms
- ✅ **PASS**: All diagrams include alt-text; code blocks tagged with language
- ✅ **PASS**: Hardware alternatives documented (cloud Isaac Sim, lightweight Gazebo headless)
- ✅ **PASS**: Content designed for non-English speakers (simple syntax, visual focus)

**Principle VII: RAG-Ready Structured Content**
- ✅ **PASS**: Content hierarchy: Chapter (H1) → Lessons (H2) → Topics (H3) → Concepts (H4)
- ✅ **PASS**: Key concepts (Sensor Configuration, Physics World, Digital Twin) defined in glossary format
- ✅ **PASS**: Metadata frontmatter (keywords, learning objectives, prerequisites) planned for each lesson

**GATE STATUS**: ✅ **ALL PRINCIPLES PASS** — No violations; no complexity exceptions needed.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-chapter-3-simulation/
├── spec.md                      # Feature specification (user stories, requirements, success criteria)
├── checklists/requirements.md   # Specification quality validation (APPROVED)
├── plan.md                      # This file (implementation plan)
├── research.md                  # Phase 0 research (technology selection, best practices)
├── data-model.md                # Phase 1 design (lesson structure, content hierarchy, interactive components)
├── quickstart.md                # Phase 1 quickstart (student-facing getting-started guide)
├── contracts/                   # Phase 1 (not applicable for textbook — reserved for API specs if needed)
└── tasks.md                     # Phase 2 output (discrete writing/code tasks with acceptance criteria)
```

### Source Code & Content (repository root)

```text
physical-ai-textbook/
├── docs/
│   └── chapter-3/                      # Chapter 3 MDX content
│       ├── lesson-1-gazebo.mdx         # Lesson 3.1: Physics Simulation
│       ├── lesson-2-unity.mdx          # Lesson 3.2: High-Fidelity Rendering
│       ├── lesson-3-isaac.mdx          # Lesson 3.3: NVIDIA Isaac Sim
│       ├── lesson-4-sensors.mdx        # Lesson 3.4: Sensor Simulation & Synthetic Data
│       └── index.mdx                   # Chapter overview and learning roadmap
│
├── examples/
│   └── chapter-3/                      # Runnable code examples (12 total)
│       ├── gazebo/
│       │   ├── 1_hello_gazebo.py       # Example 1.1
│       │   ├── 2_import_urdf.py        # Example 1.2
│       │   └── 3_control_joints.py     # Example 1.3
│       ├── unity/
│       │   ├── 1_import_model.py       # Example 2.1
│       │   ├── 2_lighting_setup.py     # Example 2.2
│       │   └── 3_export_rendering.py   # Example 2.3
│       ├── isaac/
│       │   ├── 1_import_robot.py       # Example 3.1
│       │   ├── 2_task_graph.py         # Example 3.2
│       │   └── 3_synthetic_data.py     # Example 3.3
│       └── sensors/
│           ├── 1_lidar_sim.py          # Example 4.1
│           ├── 2_depth_camera.py       # Example 4.2
│           └── 3_dataset_gen.py        # Example 4.3
│
├── assets/
│   └── chapter-3/                      # Diagrams and screenshots
│       ├── diagrams/
│       │   ├── gazebo-architecture.svg
│       │   ├── physics-pipeline.svg
│       │   ├── rendering-flow.svg
│       │   ├── isaac-overview.svg
│       │   ├── lidar-architecture.svg
│       │   ├── depth-camera-model.svg
│       │   ├── sensor-fusion.svg
│       │   └── sim-to-real-flow.svg
│       └── screenshots/
│           ├── gazebo-interface.png
│           ├── isaac-sim-ui.png
│           └── point-cloud-viz.png
│
└── interactive/
    └── chapter-3/                      # Web components (4 total)
        ├── gazebo-world-builder/       # Component 1: Drag-drop Gazebo world editor
        ├── unity-scene-preview/        # Component 2: WebGL scene viewer
        ├── isaac-task-designer/        # Component 3: RL task graph UI
        └── sensor-visualizer/          # Component 4: 3D point cloud viewer
```

**Structure Decision**:
- **Content**: Docusaurus MDX files under `docs/chapter-3/` with YAML frontmatter for RAG metadata
- **Code Examples**: Standalone Python scripts under `examples/chapter-3/` grouped by lesson; each example includes inline comments and expected output documentation
- **Assets**: Diagrams (SVG for scalability) and screenshots organized separately; alt-text in image metadata
- **Interactive Components**: React/TypeScript web components served via Docusaurus for inline visualization (world builder, scene viewer, task designer, point cloud visualizer)
- **No separate tests directory**: Code examples are self-contained and testable (no unit test framework required for educational examples)

---

## Implementation Phases

### Phase 0: Research (Consolidate unknowns)
**Deliverable**: `research.md`

Key areas to research:
1. **Gazebo Garden best practices**: Sensor plugin configuration, physics engine selection (ODE vs. Bullet), ROS 2 bridge integration
2. **Unity Robotics Hub**: Version compatibility with ROS 2 Humble, TCP connector setup, scene export formats
3. **Isaac Sim on Omniverse**: Cloud registration flow, synthetic data export format, task graph structure
4. **Sensor simulation**: Realistic noise models (Gaussian, salt-pepper), calibration parameters, ROS 2 message compatibility
5. **Domain randomization**: Best practices for synthetic data variety (lighting, textures, object poses)

### Phase 1: Design & Contracts (Architecture + Quickstart)
**Deliverables**: `data-model.md`, `quickstart.md`, agent context update

1. **Data Model**: Define lesson structure, learning objectives, prerequisite mapping, content hierarchy
2. **Quickstart**: Student-facing 15-minute "hello world" guide (load URDF in Gazebo, visualize in Rviz)
3. **Agent Context**: Update `.specify/agents/` context with ROS 2 + Gazebo + Isaac Sim patterns

### Phase 2: Task Decomposition (NOT in /sp.plan — run /sp.tasks separately)
**Deliverable**: `tasks.md`

- Break each lesson into discrete 1-2 hour tasks (e.g., "Write Lesson 3.1 Introduction", "Implement Example 1.1 Code", "Create Gazebo Architecture Diagram")
- Each task includes acceptance criteria (passing tests, diagram renders, example copy-paste works)
- Ordered by dependency (diagrams before examples, research before implementation)

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

✅ **NO VIOLATIONS** — All complexity is justified by educational value:

| Architectural Choice | Rationale | Simpler Alternative Rejected |
|-----|------|------|
| 4 separate platforms (Gazebo, Unity, Isaac, sensors) | Each platform teaches different skills: Gazebo (physics), Unity (rendering), Isaac (photorealism), Sensors (data pipeline). Removing any breaks learning progression. | Single-platform approach reduces learning breadth and excludes students without GPU access (cloud Isaac not viable without foundation) |
| 12 code examples across 4 lessons | Beginner-First Pedagogy mandates 3+ examples per lesson for hands-on practice. Less than 12 examples fails success criteria SC-012. | Fewer examples reduces student confidence and code comprehension |
| 8 diagrams (2 per lesson) | Visual-First Communication mandates minimum 1 diagram per major concept. 2 per lesson covers lesson architecture + sensor/physics pipeline. | Single diagram per lesson insufficient for complex systems (e.g., sensor fusion, render pipeline) |
| Interactive web components | Enables hands-on exploration without requiring local Gazebo/Unity/Isaac installation. Supports cloud-based learning. | Removing components reduces accessibility and forces students to install heavy tools (100+ GB for Isaac) |

---

## Next Steps

1. **Run Phase 0 Research**: Generate `research.md` (technology selection, best practices)
2. **Validate Constitution Compliance**: Re-check after Phase 1 design completes
3. **Execute Phase 2 Tasks**: Run `/sp.tasks` to decompose lessons into discrete writing/code tasks
4. **Parallel Work Streams**:
   - **Content**: Writing team creates MDX lesson files
   - **Code**: Engineering team implements 12 examples, tests in ROS 2 Humble
   - **Graphics**: Design team creates 8 diagrams (SVG) and captures 3 screenshots
   - **Components**: Frontend team builds 4 interactive web components

---

**STATUS**: ✅ **PLAN APPROVED** — Ready for Phase 0 research and `/sp.tasks` decomposition.

**GATED COMPLETION CRITERIA**:
- [ ] Constitution Check (Phase 1): All 7 principles PASS
- [ ] research.md: All unknowns resolved
- [ ] data-model.md: Lesson structure finalized
- [ ] quickstart.md: Student-ready 15-minute guide
- [ ] tasks.md: All tasks defined with acceptance criteria
- [ ] Code examples: All 12 examples tested and copy-paste executable
- [ ] Diagrams: All 8 SVG diagrams render and include alt-text
- [ ] RAG structure: All MDX files include YAML frontmatter + H1-H3 hierarchy
