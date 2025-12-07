# Implementation Tasks: Chapter 2 - The Robotic Nervous System

**Feature**: Chapter 2 - ROS 2 & Control Theory
**Branch**: `001-physical-ai-textbook`
**Date**: 2025-12-06
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

---

## Task Summary

- **Total Tasks**: 85
- **Estimated Duration**: 17-21 days
- **Parallel Opportunities**: 40+ tasks can run in parallel within phases
- **User Stories**: 5 (P1: 4 stories, P2: 1 story)
- **MVP Scope**: User Story 1 (Lesson 2.1 - ROS 2 Fundamentals)

---

## Dependencies & Execution Order

### User Story Dependency Graph

```
Setup (Phase 1)
    ↓
Foundational (Phase 2)
    ↓
    ├→ US1: ROS 2 Fundamentals (Independent)
    ├→ US2: URDF Modeling (Depends on US1)
    ├→ US3: Control Theory (Depends on US2)
    └→ US4: Edge Deployment (Depends on US3)
        ↓
    US5: Assessment System (Depends on all above)
        ↓
Polish & Integration (Final Phase)
```

**Critical Path**: US1 → US2 → US3 → US4 → US5 → Polish (sequential dependencies)

**Parallel Opportunities**:
- Within each user story, most component tasks can run in parallel
- Diagrams, code examples, and quizzes within same lesson can be created concurrently
- All 4 interactive components can be developed in parallel after foundational work

---

## Implementation Strategy

**MVP-First Approach**:
1. **Sprint 1 (Days 1-5)**: Complete User Story 1 (Lesson 2.1) - Fully functional ROS 2 lesson
2. **Sprint 2 (Days 6-10)**: Complete User Story 2 (Lesson 2.2) - URDF modeling lesson
3. **Sprint 3 (Days 11-15)**: Complete User Stories 3 & 4 (Lessons 2.3 & 2.4)
4. **Sprint 4 (Days 16-17)**: Complete User Story 5 (Assessment System)
5. **Sprint 5 (Days 18-21)**: Polish, integration testing, documentation

**Incremental Delivery**: Each sprint delivers a complete, testable lesson that students can use immediately.

---

## Phase 1: Setup & Project Initialization

**Goal**: Prepare development environment and project structure for Chapter 2 implementation

**Independent Test Criteria**:
- [ ] All npm dependencies install without errors
- [ ] Docusaurus dev server starts on http://localhost:3000
- [ ] Chapter 2 directory structure exists with placeholder files
- [ ] rosbridge WebSocket server starts on port 9090

### Tasks

- [ ] T001 Install npm dependencies for Chapter 2 components: `npm install three @types/three d3 @types/d3 recharts monaco-editor socket.io-client`
- [ ] T002 [P] Create Chapter 2 directory structure in docs/chapter-2/ with subdirectories: assets/diagrams/, assets/code-examples/, assets/urdf-models/, assets/meshes/
- [ ] T003 [P] Create component directory structure in src/components/chapter-2/ with subdirectories: NodeVisualizer/, URDFEditor/, PIDTuner/, DeploymentDashboard/
- [ ] T004 [P] Create test directory structure in tests/components/chapter-2/ and tests/ros2/
- [ ] T005 Create placeholder files for 4 lessons: docs/chapter-2/lesson-2-1-ros2-fundamentals.md, lesson-2-2-urdf-modeling.md, lesson-2-3-control-theory.md, lesson-2-4-deployment.md
- [ ] T006 Create chapter index page: docs/chapter-2/chapter-2-index.md with navigation links to all 4 lessons
- [ ] T007 Update sidebars.ts to include Chapter 2 with all 4 lessons in correct order
- [ ] T008 [P] Create shared custom hooks directory: src/hooks/ with placeholder files for useROS2Bridge.ts, useURDFValidator.ts, usePIDSimulation.ts
- [ ] T009 Verify Docusaurus build succeeds with new structure: `npm run build`

**Time Estimate**: 2-3 hours

---

## Phase 2: Foundational Components

**Goal**: Build shared infrastructure needed by all user stories

**Independent Test Criteria**:
- [ ] rosbridge WebSocket server connects successfully from browser
- [ ] AuthContext integration allows reading user.preferences.expertise
- [ ] PersonalizationToggle works with Chapter 2 content
- [ ] TypeScript compiles without errors for all shared hooks

### Tasks

- [ ] T010 Create useROS2Bridge.ts hook in src/hooks/useROS2Bridge.ts with WebSocket connection management, node/topic querying, and reconnection logic
- [ ] T011 [P] Create useURDFValidator.ts hook in src/hooks/useURDFValidator.ts with debounced validation API calls and error parsing
- [ ] T012 [P] Create usePIDSimulation.ts hook in src/hooks/usePIDSimulation.ts with discrete-time PID controller, system simulator, and metrics calculation
- [ ] T013 Test useROS2Bridge hook: Create test file tests/components/chapter-2/useROS2Bridge.test.ts to verify WebSocket connection and data fetching
- [ ] T014 Test usePIDSimulation hook: Create test file tests/components/chapter-2/usePIDSimulation.test.ts to verify PID calculation accuracy
- [ ] T015 Update AuthContext integration: Verify PersonalizationToggle component works with Chapter 2 content filtering
- [ ] T016 Create shared CSS variables for Chapter 2 in src/components/chapter-2/shared.module.css with colors, spacing, and animation constants

**Time Estimate**: 1 day

---

## Phase 3: User Story 1 - ROS 2 Fundamentals (Lesson 2.1)

**Priority**: P1

**Goal**: Students can install ROS 2 Humble, understand architecture, create publisher/subscriber nodes, and visualize with Node Visualizer

**Independent Test Criteria**:
- [ ] Lesson 2.1 MDX file builds without errors and renders correctly
- [ ] All 6+ code examples (Python/C++) compile and run in ROS 2 Humble
- [ ] Node Visualizer component renders with demo data (talker/listener nodes)
- [ ] Quiz 2.1 displays 10 questions with immediate feedback
- [ ] ROS 2 installation guide steps are testable in fresh Ubuntu 22.04 environment
- [ ] Lesson completion tracked in LocalStorage via AuthContext

### Content Tasks

- [ ] T017 [US1] Write Lesson 2.1 introduction section in docs/chapter-2/lesson-2-1-ros2-fundamentals.md covering middleware concepts, ROS 1 vs ROS 2, DDS layer
- [ ] T018 [P] [US1] Write ROS 2 architecture section explaining nodes, topics, services, actions, parameters with bullet points and definitions
- [ ] T019 [P] [US1] Write ROS 2 CLI tools section covering ros2 node, topic, service commands with examples
- [ ] T020 [P] [US1] Write ROS 2 installation guide section with step-by-step Ubuntu 22.04 + Humble instructions, troubleshooting tips
- [ ] T021 [P] [US1] Write hands-on section for creating first package with colcon, running talker/listener, using RVIZ2

### Diagram Tasks

- [ ] T022 [P] [US1] Create ROS 2 architecture diagram showing nodes, topics, services, actions with SVG in docs/chapter-2/assets/diagrams/ros2-architecture.svg
- [ ] T023 [P] [US1] Create DDS discovery process flowchart in docs/chapter-2/assets/diagrams/dds-discovery.svg
- [ ] T024 [P] [US1] Create QoS compatibility matrix diagram in docs/chapter-2/assets/diagrams/qos-matrix.svg

### Code Example Tasks

- [ ] T025 [P] [US1] Create Python talker node in docs/chapter-2/assets/code-examples/talker.py with rclpy, String publisher, 10Hz timer
- [ ] T026 [P] [US1] Create Python listener node in docs/chapter-2/assets/code-examples/listener.py with rclpy, String subscriber, logging
- [ ] T027 [P] [US1] Create C++ talker node in docs/chapter-2/assets/code-examples/talker.cpp with rclcpp equivalent
- [ ] T028 [P] [US1] Create C++ listener node in docs/chapter-2/assets/code-examples/listener.cpp with rclcpp equivalent
- [ ] T029 [P] [US1] Create custom message definition in docs/chapter-2/assets/code-examples/JointCommand.msg with joint_name (string) and position (float64) fields
- [ ] T030 [P] [US1] Create launch file example in docs/chapter-2/assets/code-examples/demo.launch.py launching talker and listener nodes

### Interactive Component: Node Visualizer

- [ ] T031 [US1] Create NodeVisualizer component file in src/components/chapter-2/NodeVisualizer/NodeVisualizer.tsx with props interface (demoNodes, demoTopics, onMessageInject)
- [ ] T032 [US1] Implement GraphLayout.ts in src/components/chapter-2/NodeVisualizer/GraphLayout.ts using D3.js force-directed layout with 50+ node support
- [ ] T033 [US1] Implement TopicStream.tsx in src/components/chapter-2/NodeVisualizer/TopicStream.tsx showing real-time message flow with animation
- [ ] T034 [US1] Implement MessageInjector.tsx in src/components/chapter-2/NodeVisualizer/MessageInjector.tsx with form to publish test messages
- [ ] T035 [US1] Create NodeVisualizer.module.css in src/components/chapter-2/NodeVisualizer/ with responsive layout, node/topic styling
- [ ] T036 [US1] Integrate useROS2Bridge hook into NodeVisualizer component for live ROS 2 graph data
- [ ] T037 [US1] Add keyboard navigation to NodeVisualizer component: arrow keys to navigate nodes, Enter to select, Escape to deselect
- [ ] T038 [US1] Test NodeVisualizer component: Create tests/components/chapter-2/NodeVisualizer.test.tsx with RTL tests for rendering, interaction, WebSocket integration

### Quiz Tasks

- [ ] T039 [P] [US1] Create Quiz 2.1 component file in docs/chapter-2/quiz-2-1.md with 6 multiple-choice, 2 true/false, 2 code-completion questions
- [ ] T040 [US1] Write quiz questions covering ROS 2 vs ROS 1, DDS implementation, QoS policies, CLI tools usage, node communication patterns
- [ ] T041 [US1] Add quiz explanations for each question with references to lesson sections

### Integration Tasks

- [ ] T042 [US1] Embed NodeVisualizer component in lesson-2-1-ros2-fundamentals.md with demo props (talker/listener example)
- [ ] T043 [US1] Add PersonalizationToggle integration to filter beginner/intermediate/expert content in Lesson 2.1
- [ ] T044 [US1] Add alt text to all diagrams in Lesson 2.1 for accessibility (WCAG 2.1 AA compliance)
- [ ] T045 [US1] Test Lesson 2.1: Verify all code examples run successfully in ROS 2 Humble Docker container using tests/ros2/test_lesson_2_1_examples.py

**Time Estimate**: 4-5 days

---

## Phase 4: User Story 2 - URDF Modeling (Lesson 2.2)

**Priority**: P1

**Dependencies**: Requires US1 completion (ROS 2 knowledge)

**Goal**: Students can create URDF robot models, add meshes, validate syntax, visualize in 3D, compute forward kinematics

**Independent Test Criteria**:
- [ ] Lesson 2.2 MDX file builds and renders with URDF Editor embedded
- [ ] URDF Editor loads example biped URDF and renders in Three.js
- [ ] Joint sliders manipulate robot visualization in real-time
- [ ] URDF validation API returns errors for invalid models
- [ ] All URDF example files pass check_urdf validation
- [ ] Quiz 2.2 tests URDF syntax and kinematics understanding

### Content Tasks

- [ ] T046 [US2] Write Lesson 2.2 introduction section in docs/chapter-2/lesson-2-2-urdf-modeling.md covering robot description formats (URDF, SDF, MJCF)
- [ ] T047 [P] [US2] Write URDF fundamentals section explaining XML structure, links, joints, visual/collision/inertial properties
- [ ] T048 [P] [US2] Write humanoid-specific modeling section covering tree structure, joint types, chain vs tree kinematics, center of mass
- [ ] T049 [P] [US2] Write URDF-to-SDF conversion section explaining differences, nested models, physics properties, plugin system
- [ ] T050 [P] [US2] Write forward/inverse kinematics theory section with Denavit-Hartenberg parameters, transformation matrices

### Diagram Tasks

- [ ] T051 [P] [US2] Create URDF link-joint hierarchy diagram in docs/chapter-2/assets/diagrams/urdf-hierarchy.svg
- [ ] T052 [P] [US2] Create humanoid kinematic chain diagram in docs/chapter-2/assets/diagrams/humanoid-chain.svg
- [ ] T053 [P] [US2] Create forward kinematics example diagram in docs/chapter-2/assets/diagrams/forward-kinematics.svg
- [ ] T054 [P] [US2] Create coordinate frame transformations diagram in docs/chapter-2/assets/diagrams/transforms.svg

### URDF Model Tasks

- [ ] T055 [P] [US2] Create simple 2-link robot URDF in docs/chapter-2/assets/urdf-models/simple_arm.urdf with revolute joints
- [ ] T056 [P] [US2] Create 12-DOF biped URDF in docs/chapter-2/assets/urdf-models/simple_biped.urdf with torso, 2 legs (6 DOF each)
- [ ] T057 [P] [US2] Create example STL meshes for biped parts in docs/chapter-2/assets/meshes/ (torso.stl, leg_upper.stl, leg_lower.stl, foot.stl)
- [ ] T058 [US2] Validate all URDF models using check_urdf tool and fix any errors

### Code Example Tasks

- [ ] T059 [P] [US2] Create Python forward kinematics solver in docs/chapter-2/assets/code-examples/fk_solver.py using transformation matrices
- [ ] T060 [P] [US2] Create Python inverse kinematics solver in docs/chapter-2/assets/code-examples/ik_solver.py using numerical methods or analytical solution
- [ ] T061 [P] [US2] Create URDF parser example in docs/chapter-2/assets/code-examples/urdf_parser.py demonstrating XML parsing and link/joint extraction

### Interactive Component: URDF Editor

- [ ] T062 [US2] Create URDFEditor component file in src/components/chapter-2/URDFEditor/URDFEditor.tsx with props (initialURDF, onURDFChange, robotType)
- [ ] T063 [US2] Implement CodeEditor.tsx in src/components/chapter-2/URDFEditor/CodeEditor.tsx using Monaco Editor with XML syntax highlighting
- [ ] T064 [US2] Implement ThreeViewer.tsx in src/components/chapter-2/URDFEditor/ThreeViewer.tsx using Three.js to render URDF model with OrbitControls
- [ ] T065 [US2] Implement URDFParser.ts in src/components/chapter-2/URDFEditor/URDFParser.ts to convert XML → JSON for Three.js rendering
- [ ] T066 [US2] Implement JointSliders.tsx in src/components/chapter-2/URDFEditor/JointSliders.tsx with sliders for each joint angle and real-time update
- [ ] T067 [US2] Implement TemplateLibrary.tsx in src/components/chapter-2/URDFEditor/TemplateLibrary.tsx with preset URDF models (biped, quadruped, arm)
- [ ] T068 [US2] Create URDFEditor.module.css with split-pane layout (editor 50%, 3D view 50%), responsive design
- [ ] T069 [US2] Integrate useURDFValidator hook into URDFEditor for real-time validation with error highlighting
- [ ] T070 [US2] Add mesh loading to ThreeViewer.tsx: Support STL, DAE, OBJ formats with STLLoader, ColladaLoader
- [ ] T071 [US2] Optimize ThreeViewer.tsx performance: Implement Level of Detail (LOD) for 100+ link models, add performance mode toggle
- [ ] T072 [US2] Test URDFEditor component: Create tests/components/chapter-2/URDFEditor.test.tsx with tests for parsing, rendering, validation

### Quiz Tasks

- [ ] T073 [P] [US2] Create Quiz 2.2 in docs/chapter-2/quiz-2-2.md with questions on URDF syntax, joint types, kinematics, transform trees
- [ ] T074 [US2] Write quiz questions covering link/joint definitions, visual vs collision geometry, inertial properties, kinematics problem-solving

### Integration Tasks

- [ ] T075 [US2] Embed URDFEditor component in lesson-2-2-urdf-modeling.md with simple_biped.urdf as default
- [ ] T076 [US2] Test Lesson 2.2: Create tests/ros2/test_lesson_2_2_examples.py to validate all URDF models and run FK/IK solvers

**Time Estimate**: 4-5 days

---

## Phase 5: User Story 3 - Control Theory (Lesson 2.3)

**Priority**: P1

**Dependencies**: Requires US2 completion (URDF models needed for control)

**Goal**: Students can implement PID controllers, understand ZMP stability, generate walking gaits, use IMU feedback

**Independent Test Criteria**:
- [ ] Lesson 2.3 content explains PID, ZMP, gait generation clearly
- [ ] PID Tuner component simulates step response with adjustable gains
- [ ] Performance metrics (rise time, overshoot, settling time) calculate correctly
- [ ] All control algorithm code examples run without errors
- [ ] Quiz 2.3 tests PID tuning and ZMP understanding

### Content Tasks

- [ ] T077 [US3] Write Lesson 2.3 introduction in docs/chapter-2/lesson-2-3-control-theory.md covering control theory primer, open/closed-loop, feedback systems
- [ ] T078 [P] [US3] Write PID control section explaining proportional, integral, derivative terms, tuning methods (Ziegler-Nichols), anti-windup
- [ ] T079 [P] [US3] Write bipedal stability section covering CoM, CoP, ZMP criterion, static vs dynamic stability
- [ ] T080 [P] [US3] Write gait generation section explaining foot trajectory planning, swing/stance phases, timing and synchronization
- [ ] T081 [P] [US3] Write sensor fusion section covering IMU data processing, complementary filter, corrective torque calculation

### Diagram Tasks

- [ ] T082 [P] [US3] Create PID control block diagram in docs/chapter-2/assets/diagrams/pid-block-diagram.svg
- [ ] T083 [P] [US3] Create step response graphs in docs/chapter-2/assets/diagrams/step-response.svg (underdamped, overdamped, critically damped)
- [ ] T084 [P] [US3] Create ZMP diagram in docs/chapter-2/assets/diagrams/zmp-diagram.svg with support polygon, CoP trajectory
- [ ] T085 [P] [US3] Create gait cycle phases diagram in docs/chapter-2/assets/diagrams/gait-cycle.svg

### Code Example Tasks

- [ ] T086 [P] [US3] Create PID controller class (Python) in docs/chapter-2/assets/code-examples/pid_controller.py with compute() method
- [ ] T087 [P] [US3] Create PID controller class (C++) in docs/chapter-2/assets/code-examples/pid_controller.cpp with equivalent implementation
- [ ] T088 [P] [US3] Create ZMP calculator in docs/chapter-2/assets/code-examples/zmp_calculator.py computing ZMP from force/torque
- [ ] T089 [P] [US3] Create gait generator in docs/chapter-2/assets/code-examples/gait_generator.py with foot trajectory planner
- [ ] T090 [P] [US3] Create IMU balance controller in docs/chapter-2/assets/code-examples/imu_balance.py using complementary filter
- [ ] T091 [P] [US3] Create emergency stop node in docs/chapter-2/assets/code-examples/emergency_stop.py with fall detection

### Interactive Component: PID Tuner

- [ ] T092 [US3] Create PIDTuner component file in src/components/chapter-2/PIDTuner/PIDTuner.tsx with props (systemModel, initialPID, onPIDChange)
- [ ] T093 [US3] Implement ParameterSliders.tsx in src/components/chapter-2/PIDTuner/ParameterSliders.tsx with Kp, Ki, Kd sliders (range: 0-10, 0-5, 0-2)
- [ ] T094 [US3] Implement StepResponseGraph.tsx in src/components/chapter-2/PIDTuner/StepResponseGraph.tsx using Recharts with LineChart
- [ ] T095 [US3] Implement PIDSimulator.ts in src/components/chapter-2/PIDTuner/PIDSimulator.ts with discrete-time PID and system models (first-order, second-order)
- [ ] T096 [US3] Implement PerformanceMetrics.tsx in src/components/chapter-2/PIDTuner/PerformanceMetrics.tsx calculating rise time, overshoot, settling time, steady-state error
- [ ] T097 [US3] Create PIDTuner.module.css with layout (sliders left 30%, graph right 70%, metrics bottom)
- [ ] T098 [US3] Add preset configurations to PIDTuner: Underdamped, Critically Damped, Overdamped presets
- [ ] T099 [US3] Integrate usePIDSimulation hook into PIDTuner for real-time simulation
- [ ] T100 [US3] Add reference signal selector to PIDTuner: Step, Ramp, Sine inputs
- [ ] T101 [US3] Test PIDTuner component: Create tests/components/chapter-2/PIDTuner.test.tsx verifying simulation accuracy and metrics

### Quiz Tasks

- [ ] T102 [P] [US3] Create Quiz 2.3 in docs/chapter-2/quiz-2-3.md with questions on PID parameters, ZMP stability, gait phases, sensor fusion
- [ ] T103 [US3] Write quiz questions testing PID tuning effects, ZMP conditions, gait transitions

### Integration Tasks

- [ ] T104 [US3] Embed PIDTuner component in lesson-2-3-control-theory.md with second-order system example
- [ ] T105 [US3] Test Lesson 2.3: Create tests/ros2/test_lesson_2_3_examples.py to run all control algorithm examples

**Time Estimate**: 5-6 days

---

## Phase 6: User Story 4 - Edge Deployment (Lesson 2.4)

**Priority**: P2

**Dependencies**: Requires US3 completion (controllers to deploy)

**Goal**: Students can create ROS 2 packages, cross-compile for Jetson, monitor performance, deploy controllers

**Independent Test Criteria**:
- [ ] Lesson 2.4 explains package structure and deployment workflow
- [ ] Deployment Dashboard connects to simulated Jetson via WebSocket
- [ ] System metrics (CPU, RAM, network) display correctly
- [ ] Node management (restart, view logs) works
- [ ] Quiz 2.4 tests deployment knowledge

### Content Tasks

- [ ] T106 [US4] Write Lesson 2.4 introduction in docs/chapter-2/lesson-2-4-deployment.md covering ROS 2 package structure, deployment pipeline
- [ ] T107 [P] [US4] Write package management section explaining CMakeLists.txt, package.xml, workspace organization, dependencies
- [ ] T108 [P] [US4] Write cross-compilation section covering ARM64 toolchain setup, colcon cross-compilation, alternative: native compilation
- [ ] T109 [P] [US4] Write real-time constraints section explaining loop frequency, latency budgets, thread priorities, PREEMPT_RT kernel
- [ ] T110 [P] [US4] Write performance monitoring section covering CPU/memory usage, message latency, profiling tools

### Diagram Tasks

- [ ] T111 [P] [US4] Create deployment architecture diagram in docs/chapter-2/assets/diagrams/deployment-architecture.svg (Dev Machine → Jetson → Robot)
- [ ] T112 [P] [US4] Create real-time loop timing diagram in docs/chapter-2/assets/diagrams/realtime-timing.svg
- [ ] T113 [P] [US4] Create safety system state machine in docs/chapter-2/assets/diagrams/safety-state-machine.svg

### Code Example Tasks

- [ ] T114 [P] [US4] Create CMakeLists.txt template in docs/chapter-2/assets/code-examples/CMakeLists.txt for ROS 2 package
- [ ] T115 [P] [US4] Create package.xml template in docs/chapter-2/assets/code-examples/package.xml with dependencies
- [ ] T116 [P] [US4] Create cross-compilation script in docs/chapter-2/assets/code-examples/cross_compile.sh for ARM64
- [ ] T117 [P] [US4] Create performance monitor node in docs/chapter-2/assets/code-examples/performance_monitor.py publishing system metrics
- [ ] T118 [P] [US4] Create deployment script in docs/chapter-2/assets/code-examples/deploy.sh using rsync + ssh
- [ ] T119 [P] [US4] Create safety watchdog node in docs/chapter-2/assets/code-examples/watchdog.py with health checks

### Interactive Component: Deployment Dashboard

- [ ] T120 [US4] Create DeploymentDashboard component in src/components/chapter-2/DeploymentDashboard/DeploymentDashboard.tsx with props (targetHardware, connectionStatus)
- [ ] T121 [US4] Implement HardwareStatus.tsx in src/components/chapter-2/DeploymentDashboard/HardwareStatus.tsx showing Jetson connection, sensors, actuators
- [ ] T122 [US4] Implement SystemMetrics.tsx in src/components/chapter-2/DeploymentDashboard/SystemMetrics.tsx with CPU/RAM/network graphs using Recharts
- [ ] T123 [US4] Implement NodeManager.tsx in src/components/chapter-2/DeploymentDashboard/NodeManager.tsx listing ROS 2 nodes with restart buttons
- [ ] T124 [US4] Implement LogViewer.tsx in src/components/chapter-2/DeploymentDashboard/LogViewer.tsx with filtering (level, node, search)
- [ ] T125 [US4] Implement CodeUploader.tsx in src/components/chapter-2/DeploymentDashboard/CodeUploader.tsx with file upload and deployment progress
- [ ] T126 [US4] Create DeploymentDashboard.module.css with grid layout (hardware status top, metrics middle, nodes/logs bottom)
- [ ] T127 [US4] Create WebSocket client in DeploymentDashboard connecting to ws://localhost:9091 (via SSH tunnel)
- [ ] T128 [US4] Add reconnection logic to DeploymentDashboard with exponential backoff
- [ ] T129 [US4] Test DeploymentDashboard component: Create tests/components/chapter-2/DeploymentDashboard.test.tsx with WebSocket mocking

### Quiz Tasks

- [ ] T130 [P] [US4] Create Quiz 2.4 in docs/chapter-2/quiz-2-4.md with questions on package dependencies, cross-compilation, real-time constraints, safety
- [ ] T131 [US4] Write quiz questions testing deployment process, performance monitoring

### Integration Tasks

- [ ] T132 [US4] Embed DeploymentDashboard component in lesson-2-4-deployment.md with demo mode (simulated Jetson)
- [ ] T133 [US4] Test Lesson 2.4: Create tests/ros2/test_lesson_2_4_examples.py to validate deployment scripts

**Time Estimate**: 3-4 days

---

## Phase 7: User Story 5 - Assessment System (All Lessons)

**Priority**: P2

**Dependencies**: Requires US1-US4 completion (all content must exist)

**Goal**: Students can take quizzes, submit assignments, complete capstone project with auto-grading

**Independent Test Criteria**:
- [ ] All 4 quizzes display correctly with immediate feedback
- [ ] Quiz scores save to LocalStorage via AuthContext
- [ ] Assignment submission form accepts GitHub repo URL
- [ ] Capstone project rubric displays evaluation criteria
- [ ] Progress dashboard shows completion percentage

### Assessment Tasks

- [ ] T134 [US5] Create quiz component wrapper in src/components/chapter-2/Quiz/Quiz.tsx with props (questions, passingScore, timeLimit, onSubmit)
- [ ] T135 [US5] Implement QuestionRenderer.tsx in src/components/chapter-2/Quiz/QuestionRenderer.tsx supporting multiple-choice, true/false, code-completion types
- [ ] T136 [US5] Implement quiz scoring logic in src/components/chapter-2/Quiz/QuizScoring.ts calculating percentage, providing explanations
- [ ] T137 [US5] Integrate quiz components into all 4 quiz files (quiz-2-1.md, quiz-2-2.md, quiz-2-3.md, quiz-2-4.md)
- [ ] T138 [US5] Create assignment submission component in src/components/chapter-2/Assignment/AssignmentSubmission.tsx with GitHub URL form
- [ ] T139 [US5] Create capstone project page in docs/chapter-2/capstone-project.md with requirements (balance controller, URDF model, demo video)
- [ ] T140 [US5] Create rubric display component in src/components/chapter-2/Assignment/RubricDisplay.tsx showing evaluation criteria
- [ ] T141 [US5] Create progress dashboard component in src/components/chapter-2/Progress/ProgressDashboard.tsx showing lesson completion, quiz scores
- [ ] T142 [US5] Integrate progress tracking with AuthContext: Save quiz attempts, assignment submissions to LocalStorage
- [ ] T143 [US5] Create peer review component in src/components/chapter-2/PeerReview/PeerReview.tsx for capstone project reviews
- [ ] T144 [US5] Test quiz components: Create tests/components/chapter-2/Quiz.test.tsx verifying scoring, explanations, LocalStorage integration
- [ ] T145 [US5] Test assignment submission: Create tests/components/chapter-2/AssignmentSubmission.test.tsx with form validation

### Rubric Definition Tasks

- [ ] T146 [P] [US5] Define quiz rubric in docs/chapter-2/rubrics/quiz-rubric.md (70% passing, immediate feedback, unlimited attempts)
- [ ] T147 [P] [US5] Define assignment rubric in docs/chapter-2/rubrics/assignment-rubric.md (code quality 40%, functionality 40%, documentation 20%)
- [ ] T148 [P] [US5] Define capstone rubric in docs/chapter-2/rubrics/capstone-rubric.md (URDF model 30%, PID controller 40%, video demo 30%)

**Time Estimate**: 2-3 days

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Ensure all Chapter 2 content meets quality standards, accessibility, and performance requirements

**Independent Test Criteria**:
- [ ] All interactive components pass WCAG 2.1 AA accessibility audit
- [ ] Page load time <3 seconds on 10 Mbps connection
- [ ] All 40+ code examples validated in CI/CD
- [ ] Urdu translations available for key terms
- [ ] Mobile responsive design works on tablets/phones

### Quality Assurance Tasks

- [ ] T149 Run accessibility audit on all 4 lessons using axe-core: Fix any WCAG 2.1 AA violations
- [ ] T150 [P] Add Urdu translations for Chapter 2 in i18n/ur/docusaurus-plugin-content-docs/current/chapter-2/ (chapter index, glossary terms)
- [ ] T151 [P] Optimize Three.js performance in URDFEditor: Enable LOD, reduce polygon count for complex meshes
- [ ] T152 [P] Optimize D3.js performance in NodeVisualizer: Implement quadtree for collision detection, throttle force simulation
- [ ] T153 Test mobile responsive design: Verify all interactive components work on iPad (1024x768) and iPhone (375x667)
- [ ] T154 Create E2E test suite using Playwright in tests/e2e/chapter-2-workflows.spec.ts covering: complete Lesson 2.1, take Quiz 2.1, use Node Visualizer
- [ ] T155 Set up CI/CD pipeline for Chapter 2: GitHub Actions workflow to run all tests (Jest, Playwright, ROS 2 code validation)
- [ ] T156 Create Docker-based test environment: Dockerfile with ROS 2 Humble + Node.js 18 for CI/CD testing
- [ ] T157 Validate all 40+ code examples in CI/CD: Run tests/ros2/test_all_examples.py in Docker container
- [ ] T158 Performance benchmark all interactive components: Measure fps, load time, latency and verify against targets (30-60 fps, <2s load, <100ms latency)
- [ ] T159 [P] Create troubleshooting guide in docs/chapter-2/troubleshooting.md covering common errors (rosbridge connection, URDF validation, WebGL issues)
- [ ] T160 [P] Update main README.md with Chapter 2 completion status and setup instructions

### Documentation Tasks

- [ ] T161 [P] Write developer documentation in specs/002-chapter-2-ros2-control/README.md explaining how to add new lessons/components
- [ ] T162 [P] Create component API documentation: Generate TypeDoc for all Chapter 2 components
- [ ] T163 [P] Update CONTRIBUTING.md with Chapter 2 content guidelines and code example standards

### Integration Testing

- [ ] T164 Test Chapter 1 → Chapter 2 navigation: Verify links work and PersonalizationToggle persists
- [ ] T165 Test AuthContext integration: Verify quiz scores, progress, and personalization work end-to-end
- [ ] T166 Test rosbridge WebSocket reliability: Verify reconnection logic with network interruption simulation
- [ ] T167 Test URDF validation API: Verify error handling for invalid XML, missing links, negative mass
- [ ] T168 Integration test all 4 lessons sequentially: Student completes 2.1 → 2.2 → 2.3 → 2.4 → Capstone

### Deployment Tasks

- [ ] T169 Build production bundle: Run `npm run build` and verify build/ directory size <50MB (excluding node_modules)
- [ ] T170 Test production deployment: Deploy to Vercel/Netlify staging environment and verify all features work

**Time Estimate**: 3-4 days

---

## Parallel Execution Examples

### Within User Story 1 (Lesson 2.1)

**Can run in parallel** (no dependencies):
- T022, T023, T024 (Diagrams)
- T025, T026, T027, T028, T029, T030 (Code Examples)
- T039, T040, T041 (Quiz)

**Must run sequentially**:
- T017-T021 (Content) → T042 (Embedding)
- T031-T038 (NodeVisualizer) → T042 (Embedding)

### Within User Story 2 (Lesson 2.2)

**Can run in parallel**:
- T051, T052, T053, T054 (Diagrams)
- T055, T056, T057 (URDF Models)
- T059, T060, T061 (Code Examples)
- T062-T072 (URDFEditor component - most subtasks)

### Across User Stories

**Independent work streams** (can be assigned to different developers):
1. **Stream A**: US1 (Lesson 2.1 + Node Visualizer)
2. **Stream B**: US2 (Lesson 2.2 + URDF Editor) - starts after US1 content
3. **Stream C**: US3 (Lesson 2.3 + PID Tuner) - starts after US2 content
4. **Stream D**: US4 (Lesson 2.4 + Deployment Dashboard) - starts after US3 content

**Note**: Interactive components (NodeVisualizer, URDFEditor, PIDTuner, DeploymentDashboard) can be developed in parallel by 4 developers once foundational hooks (Phase 2) are complete.

---

## Test Strategy

### Unit Tests (Jest + RTL)

**Component Tests**:
- NodeVisualizer: WebSocket integration, graph rendering, message injection
- URDFEditor: XML parsing, validation API calls, Three.js rendering, joint manipulation
- PIDTuner: PID simulation accuracy, metrics calculation, preset loading
- DeploymentDashboard: WebSocket connection, metrics display, node management
- Quiz: Scoring logic, explanation display, LocalStorage persistence

**Hook Tests**:
- useROS2Bridge: Connection management, node/topic fetching, error handling
- useURDFValidator: Debounced validation, error parsing
- usePIDSimulation: PID algorithm correctness, system simulation

### Integration Tests (Playwright E2E)

**Critical User Flows**:
1. Complete Lesson 2.1: Read content → Use Node Visualizer → Take Quiz 2.1 → Pass with 70%+
2. Create URDF Model: Open URDF Editor → Load template → Modify → Validate → Download
3. Tune PID Controller: Open PID Tuner → Adjust Kp/Ki/Kd → Observe response → Export parameters
4. Deploy to Jetson (simulated): Open Dashboard → Upload package → Monitor deployment → View logs

### ROS 2 Code Validation Tests

**Automated Testing in CI/CD**:
- All Python/C++ code examples compile and run in ROS 2 Humble Docker container
- URDF models validate with check_urdf
- Package examples build with colcon
- Launch files execute without errors

### Accessibility Tests

**WCAG 2.1 AA Compliance**:
- All diagrams have alt text
- Interactive components keyboard-navigable
- Color contrast ratios >4.5:1
- Form inputs have labels
- Error messages screen-reader accessible

### Performance Tests

**Benchmarks**:
- NodeVisualizer: 50+ nodes at 30 fps
- URDFEditor: 100-link model loads in <2 seconds, renders at 30 fps
- PIDTuner: Graph updates in <100ms after slider change
- DeploymentDashboard: WebSocket latency <100ms
- Page load: <3 seconds on 10 Mbps connection

---

## Success Criteria Summary

### Lesson 2.1 (US1):
✅ User can install ROS 2 Humble following guide (success rate 90%+)
✅ User can run all code examples without errors (40+ examples)
✅ Interactive Node Visualizer visualizes ROS 2 concepts clearly (user rating 4+/5)
✅ Quiz questions test understanding effectively (average score 75%+)
✅ Personalization adapts content correctly (beginner/intermediate/expert filtering works)
✅ Urdu translation available for key terms (glossary, chapter index)

### Lesson 2.2 (US2):
✅ User can create valid URDF models (check_urdf passes)
✅ URDF Editor renders models in 3D with 60 fps
✅ Joint manipulation works in real-time
✅ Forward kinematics calculations are correct (within 1% error)

### Lesson 2.3 (US3):
✅ User can implement PID controller with correct gains
✅ PID Tuner simulates step response accurately (matches control theory predictions)
✅ ZMP calculations validate for bipedal stability
✅ Gait generation produces smooth foot trajectories

### Lesson 2.4 (US4):
✅ User can create ROS 2 package with correct structure
✅ Cross-compilation instructions work for Jetson
✅ Deployment Dashboard connects and displays metrics
✅ Performance monitoring shows accurate CPU/RAM usage

### Assessment System (US5):
✅ All quizzes display with immediate feedback
✅ Scores save to LocalStorage persistently
✅ Assignment submission accepts GitHub URLs
✅ Capstone rubric clearly defines evaluation criteria

---

## Task Completion Checklist

Use this checklist to track overall progress:

- [ ] Phase 1: Setup & Initialization (T001-T009) - 9 tasks
- [ ] Phase 2: Foundational Components (T010-T016) - 7 tasks
- [ ] Phase 3: User Story 1 (T017-T045) - 29 tasks
- [ ] Phase 4: User Story 2 (T046-T076) - 31 tasks
- [ ] Phase 5: User Story 3 (T077-T105) - 29 tasks
- [ ] Phase 6: User Story 4 (T106-T133) - 28 tasks
- [ ] Phase 7: User Story 5 (T134-T148) - 15 tasks
- [ ] Phase 8: Polish & Integration (T149-T170) - 22 tasks

**Total: 170 tasks** (updated count)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Ready for Implementation

**Next Step**: Run `/sp.implement` to begin executing tasks
