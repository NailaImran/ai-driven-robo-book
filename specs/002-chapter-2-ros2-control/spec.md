---
feature: "Chapter 2: The Robotic Nervous System - ROS 2 & Control Theory"
project: "Physical AI & Humanoid Robotics Textbook"
created: 2025-12-06
priority: P1
status: Draft
---

# Feature Specification: Chapter 2 - The Robotic Nervous System

## Executive Summary

**What**: Chapter 2 of the Physical AI textbook teaching ROS 2 architecture and control theory for humanoid robots.

**Why**: Students need hands-on experience with robotic middleware and control systems to build functional humanoid robots.

**Who**: Engineering students, robotics enthusiasts, and professionals transitioning to Physical AI.

**Success Criteria**: Students can create ROS 2 packages, model humanoid robots, implement control algorithms, and deploy to edge hardware.

---

## User Scenarios & Testing

### User Story 1: Learn ROS 2 Fundamentals (Priority: P1)

**As a** robotics student
**I want to** understand ROS 2 architecture and create basic nodes
**So that** I can build distributed robotic systems

**Acceptance Scenarios:**

**Scenario 1.1: ROS 2 Installation**
```gherkin
Given I have Ubuntu 22.04 installed
When I follow the installation guide for ROS 2 Humble
Then I should have working ros2 CLI commands
And I can run example nodes from demos package
```

**Scenario 1.2: Create First Node**
```gherkin
Given ROS 2 Humble is installed
When I create a Python publisher node
And I create a subscriber node
Then messages should flow between nodes
And I can observe them using ros2 topic echo
```

**Scenario 1.3: Visualize in RVIZ2**
```gherkin
Given I have a robot model loaded
When I launch RVIZ2
Then I should see the 3D visualization
And I can manipulate joint states interactively
```

**Scenario 1.4: Use ROS 2 CLI Tools**
```gherkin
Given multiple nodes are running
When I use ros2 node list
Then I see all active nodes
And ros2 topic list shows all topics
And ros2 service list shows available services
```

**Scenario 1.5: Debug Communication Issues**
```gherkin
Given nodes are not communicating
When I use ros2 topic info to inspect
And I check QoS settings
Then I can identify the mismatch
And fix communication by aligning QoS policies
```

---

### User Story 2: Model Humanoid Robots (Priority: P1)

**As a** robotics engineer
**I want to** create URDF models for humanoid robots
**So that** I can simulate and control them accurately

**Acceptance Scenarios:**

**Scenario 2.1: Create Basic URDF**
```gherkin
Given I understand robot kinematics
When I define links and joints in URDF
Then the model loads in RVIZ2 without errors
And joint transforms are correct
```

**Scenario 2.2: Add Visual and Collision Meshes**
```gherkin
Given I have 3D meshes for robot parts
When I reference them in URDF
Then the robot appears with proper visuals
And collision detection works in simulation
```

**Scenario 2.3: Configure Joint Controllers**
```gherkin
Given a complete URDF model
When I add ros2_control tags
Then I can command joint positions
And receive joint state feedback
```

**Scenario 2.4: Test Forward Kinematics**
```gherkin
Given joint angles are specified
When I compute forward kinematics
Then end-effector position matches expected values
And orientation is correct
```

**Scenario 2.5: Solve Inverse Kinematics**
```gherkin
Given a target end-effector pose
When I run IK solver
Then joint angles are calculated
And reaching the target is verified in simulation
```

---

### User Story 3: Implement Control Algorithms (Priority: P1)

**As a** control systems student
**I want to** implement PID controllers and gait generators
**So that** I can achieve stable bipedal locomotion

**Acceptance Scenarios:**

**Scenario 3.1: Tune PID Controller**
```gherkin
Given a joint with position feedback
When I implement PID controller
And I tune Kp, Ki, Kd parameters
Then the joint reaches setpoint with minimal overshoot
And settling time is acceptable
```

**Scenario 3.2: Implement ZMP Stability**
```gherkin
Given a bipedal robot model
When I compute Zero Moment Point during walking
Then ZMP stays within support polygon
And robot doesn't tip over
```

**Scenario 3.3: Generate Walking Gait**
```gherkin
Given foot trajectory parameters
When I generate left-right gait pattern
Then footsteps are executed smoothly
And center of mass trajectory is stable
```

**Scenario 3.4: Use IMU for Balance**
```gherkin
Given IMU sensor provides orientation
When robot tilts beyond threshold
Then corrective torques are applied
And robot recovers balance
```

**Scenario 3.5: Emergency Stop Detection**
```gherkin
Given robot is walking
When excessive tilt or acceleration detected
Then emergency stop triggers immediately
And robot enters safe state
```

---

### User Story 4: Deploy to Edge Hardware (Priority: P2)

**As a** embedded systems developer
**I want to** deploy ROS 2 nodes to NVIDIA Jetson
**So that** I can run controllers on the actual robot

**Acceptance Scenarios:**

**Scenario 4.1: Cross-Compile Package**
```gherkin
Given ROS 2 workspace on development machine
When I cross-compile for ARM64
Then binaries run on Jetson Orin
And dependencies are resolved correctly
```

**Scenario 4.2: Monitor Real-Time Performance**
```gherkin
Given controller is running on Jetson
When I monitor node execution time
Then loop frequency meets 100Hz requirement
And latency is under 10ms
```

**Scenario 4.3: Remote Debugging**
```gherkin
Given Jetson is on local network
When I connect remotely via SSH
Then I can view ROS 2 logs
And inspect running nodes
```

**Scenario 4.4: Update Firmware OTA**
```gherkin
Given new controller code is ready
When I deploy via OTA update
Then Jetson receives and installs update
And robot automatically restarts with new code
```

**Scenario 4.5: Hardware Diagnostics**
```gherkin
Given sensors and actuators connected
When I run hardware diagnostic node
Then all components report status
And errors are logged with timestamps
```

---

### User Story 5: Complete Assessments (Priority: P2)

**As a** student
**I want to** complete quizzes and projects
**So that** I can validate my understanding

**Acceptance Scenarios:**

**Scenario 5.1: Pass Lesson Quizzes**
```gherkin
Given I completed a lesson
When I take the quiz
Then I receive immediate feedback
And correct answers are explained
```

**Scenario 5.2: Submit ROS 2 Package**
```gherkin
Given I created a functional package
When I submit code via GitHub link
Then automated tests run
And I receive a score with feedback
```

**Scenario 5.3: Implement Balance Controller**
```gherkin
Given capstone project requirements
When I submit working controller
Then it's tested in simulation
And performance metrics are evaluated
```

**Scenario 5.4: Participate in Peer Review**
```gherkin
Given another student's submission
When I review their code
Then I provide constructive feedback
And they can see my comments
```

**Scenario 5.5: Track Progress**
```gherkin
Given I'm logged in
When I view Chapter 2 dashboard
Then I see completion percentage
And outstanding assessments are highlighted
```

---

## Requirements

### Functional Requirements - Content & Pedagogy

**FR-C2-001**: Chapter 2 MUST contain 4 lessons covering ROS 2, URDF, control theory, and deployment
**FR-C2-002**: Each lesson MUST have estimated reading time (30-45 min) and coding time (60-90 min)
**FR-C2-003**: All code examples MUST work with ROS 2 Humble on Ubuntu 22.04
**FR-C2-004**: Code examples MUST be provided in both Python and C++
**FR-C2-005**: Each lesson MUST include 3+ diagrams (architecture, flowcharts, or block diagrams)
**FR-C2-006**: URDF models MUST be visualizable in RVIZ2 without errors
**FR-C2-007**: Control algorithms MUST be tested in Gazebo simulation
**FR-C2-008**: Hardware deployment guide MUST support Jetson Orin and Jetson Xavier

### Functional Requirements - Interactive Components

**FR-C2-009**: MUST provide ROS 2 Node Visualizer showing real-time message flow
**FR-C2-010**: MUST provide web-based URDF editor with 3D preview
**FR-C2-011**: MUST provide interactive PID tuner with step response graph
**FR-C2-012**: MUST provide deployment dashboard with hardware status
**FR-C2-013**: All interactive components MUST work on mobile (responsive design)
**FR-C2-014**: 3D visualizations MUST use WebGL (Three.js) with 60fps performance
**FR-C2-015**: Real-time updates MUST use WebSocket connections

### Functional Requirements - Assessment

**FR-C2-016**: Each lesson MUST have a 10-question quiz
**FR-C2-017**: Quizzes MUST provide immediate feedback with explanations
**FR-C2-018**: Practical assignment MUST be auto-graded via unit tests
**FR-C2-019**: Capstone project MUST include simulation-based evaluation
**FR-C2-020**: Peer review system MUST support code comments and ratings
**FR-C2-021**: Progress tracking MUST show lesson completion and quiz scores

### Functional Requirements - Integration

**FR-C2-022**: RAG chatbot MUST be trained on ROS 2 official documentation
**FR-C2-023**: User hardware profile MUST determine deployment target (Jetson/Cloud)
**FR-C2-024**: Authentication system MUST track quiz attempts and scores
**FR-C2-025**: Personalization MUST adapt code examples to user's robot hardware
**FR-C2-026**: Chapter 2 MUST reference Chapter 1 concepts (sensors, actuators, CapEx/OpEx)
**FR-C2-027**: Chapter 2 MUST prepare for Chapter 3 (computer vision and perception)

### Functional Requirements - Accessibility & Usability

**FR-C2-028**: All diagrams MUST have descriptive alt text
**FR-C2-029**: Code blocks MUST have syntax highlighting and copy buttons
**FR-C2-030**: Interactive components MUST be keyboard-navigable
**FR-C2-031**: Videos (if any) MUST have captions and transcripts
**FR-C2-032**: Page load time MUST be under 3 seconds on 10 Mbps connection

### Non-Functional Requirements

**NFR-C2-001**: Content MUST maintain Flesch-Kincaid reading level below grade 12
**NFR-C2-002**: Code examples MUST follow ROS 2 naming conventions
**NFR-C2-003**: URDF files MUST validate against URDF schema
**NFR-C2-004**: Control algorithms MUST converge within 5 seconds in simulation
**NFR-C2-005**: Deployment scripts MUST handle network disconnections gracefully
**NFR-C2-006**: All resources (meshes, configs) MUST be under 5MB per file

---

## Success Criteria

### Educational Effectiveness

**SC-C2-001**: 85% of students complete Chapter 2 within 12 hours of study time
**SC-C2-002**: Average quiz score across all lessons is 75% or higher
**SC-C2-003**: 80% of students successfully deploy code to Jetson (or pass simulation test)
**SC-C2-004**: Capstone project submissions have 90% code correctness rate
**SC-C2-005**: Students rate chapter usefulness 4+/5 in post-chapter survey

### Technical Performance

**SC-C2-006**: ROS 2 Node Visualizer handles 50+ nodes without performance degradation
**SC-C2-007**: URDF editor loads models with 100+ links in under 2 seconds
**SC-C2-008**: PID tuner updates graphs in real-time (<100ms latency)
**SC-C2-009**: Deployment dashboard connects to Jetson within 5 seconds
**SC-C2-010**: All interactive components pass WCAG 2.1 AA accessibility standards

### Integration & Engagement

**SC-C2-011**: RAG chatbot answers ROS 2 questions with 85% accuracy
**SC-C2-012**: 70% of authenticated users customize hardware profile
**SC-C2-013**: Peer review system has 60% participation rate
**SC-C2-014**: Chapter 2 completion rate is within 10% of Chapter 1
**SC-C2-015**: Code examples are forked/starred 100+ times on GitHub

### Hackathon Scoring (if applicable)

**SC-C2-016**: Technical complexity score: 9+/10 (ROS 2 + real-time control)
**SC-C2-017**: Educational value score: 9+/10 (hands-on learning + assessments)
**SC-C2-018**: Innovation score: 8+/10 (web-based URDF editor, real-time viz)
**SC-C2-019**: Completeness score: 8+/10 (4 lessons + quizzes + projects)
**SC-C2-020**: Presentation quality: 9+/10 (interactive components, diagrams)

---

## Key Entities

### Lesson
- **Attributes**: id, title, readingTime, codingTime, content, diagrams, codeExamples, quiz
- **Relationships**: belongsTo Chapter, has many CodeExamples, has many Diagrams, has one Quiz
- **Validation**: readingTime 30-45 min, codingTime 60-90 min, content >2000 words

### CodeExample
- **Attributes**: id, language (Python|C++), code, description, requiredDependencies, testCases
- **Relationships**: belongsTo Lesson, has many TestCases
- **Validation**: code must compile/run, dependencies must be installable

### URDF Model
- **Attributes**: id, name, xmlContent, visualMeshes, collisionMeshes, joints, links
- **Relationships**: belongsTo Lesson, has many Joints, has many Links
- **Validation**: validates against URDF XSD schema, loads in RVIZ2

### ControlAlgorithm
- **Attributes**: id, type (PID|ZMP|Gait), parameters, implementation, simulationConfig
- **Relationships**: belongsTo Lesson, has many Parameters
- **Validation**: converges in simulation, meets performance requirements

### Quiz
- **Attributes**: id, questions, passingScore, timeLimit, attempts
- **Relationships**: belongsTo Lesson, has many Questions
- **Validation**: 10 questions, passing score 70%, unlimited attempts

### Assessment
- **Attributes**: id, type (Quiz|Assignment|Project), submissions, rubric, autoGrading
- **Relationships**: belongsTo User, belongsTo Lesson
- **Validation**: auto-grading tests must pass, manual review if flagged

### HardwareProfile
- **Attributes**: id, platform (Jetson|Cloud|Local), specs, connectivity, deploymentTarget
- **Relationships**: belongsTo User
- **Validation**: platform constraints validated

---

## Edge Cases

### Edge Case 1: ROS 2 Installation Fails
**Scenario**: User's system doesn't meet requirements or conflicts exist
**Handling**:
- Display detailed error message with troubleshooting steps
- Provide link to Docker-based alternative
- Offer cloud-based ROS 2 environment (no local install needed)

### Edge Case 2: URDF Model Too Complex
**Scenario**: User creates URDF with 500+ links causing browser freeze
**Handling**:
- Limit URDF editor to 200 links with warning message
- Use LOD (Level of Detail) in 3D visualization
- Offer server-side rendering for complex models

### Edge Case 3: Jetson Not Available
**Scenario**: Student doesn't have Jetson hardware for deployment
**Handling**:
- Provide cloud-based Jetson simulator
- Allow submission of deployment scripts only (graded via tests)
- Offer alternative: deploy to Docker container on local machine

### Edge Case 4: Control Algorithm Diverges
**Scenario**: Student's PID tuning causes unstable behavior
**Handling**:
- Simulation has safety limits (max joint velocity/torque)
- Auto-reset simulation if robot falls or exceeds bounds
- Provide "Reset to Stable Defaults" button

### Edge Case 5: Peer Review Abuse
**Scenario**: Student gives unfair ratings or plagiarizes reviews
**Handling**:
- Reviews are anonymous but flagged by AI for inappropriate content
- Require minimum word count (50 words) and specific feedback
- Instructor can override peer scores

### Edge Case 6: Network Latency in Real-Time Visualizer
**Scenario**: High latency causes WebSocket disconnections
**Handling**:
- Buffer up to 100 messages locally
- Reconnect automatically with exponential backoff
- Display "Offline Mode" warning with cached data

---

## Dependencies

### External Dependencies
- **ROS 2 Humble**: Core middleware (version 22.04 LTS)
- **Gazebo 11**: Physics simulation (compatible with ROS 2)
- **RVIZ2**: 3D visualization tool
- **NVIDIA Isaac Sim**: Optional advanced simulation (cloud-based)
- **Three.js**: WebGL 3D rendering (v0.150+)
- **Socket.IO**: WebSocket library for real-time communication
- **PyBullet**: Alternative lightweight physics engine (Python)

### Internal Dependencies
- **Chapter 1**: Assumes knowledge of sensors, actuators, hardware landscape
- **Authentication System**: Required for progress tracking and personalization
- **RAG Chatbot**: Must be extended with ROS 2 documentation corpus
- **Personalization Engine**: Adapts content based on user's hardware profile

### Ordering Dependencies
- **Lesson 2.1 MUST be completed before 2.2**: ROS 2 CLI skills needed for URDF work
- **Lesson 2.2 MUST be completed before 2.3**: Control algorithms need robot model
- **Lesson 2.3 MUST be completed before 2.4**: Deployment requires working controller
- **Chapter 1 MUST be completed before Chapter 2**: Foundational concepts required

---

## Constraints

### Technical Constraints
- MUST support only Ubuntu 22.04 (ROS 2 Humble target platform)
- MUST work with ROS 2 Humble (no support for Foxy, Galactic, or Rolling)
- MUST use DDS implementation: FastDDS (default) or CycloneDDS
- Interactive components MUST work in Chrome 90+, Firefox 88+, Safari 14+
- 3D visualizations MUST run at 30+ fps on devices with WebGL support
- URDF meshes MUST be in STL, DAE, or OBJ format

### Resource Constraints
- Total chapter assets (meshes, videos) MUST be under 500MB
- Individual code examples MUST run on machines with 4GB RAM minimum
- Simulation must run on systems with integrated graphics (Intel/AMD)
- Deployment guide assumes user has access to Jetson or cloud credits

### Time Constraints
- Chapter 2 total time: 8-12 hours (reading + coding + assessments)
- Each lesson: 90-135 minutes (30-45 min read + 60-90 min code)
- Quizzes: 15 minutes each (4 quizzes = 60 min)
- Capstone project: 3-5 hours

### Business Constraints
- Use free and open-source tools only (ROS 2, Gazebo, PyBullet)
- Paid cloud resources must have free tier alternatives
- Isaac Sim access via NVIDIA Developer Program (free)

---

## Out of Scope

### Explicitly Excluded
1. **ROS 1 Support**: Only ROS 2 Humble is covered (no ROS 1 Noetic)
2. **Windows Native Installation**: Ubuntu 22.04 only (Docker on Windows is acceptable)
3. **Advanced Kinematics Solvers**: KDL or MoveIt IK (covered in Chapter 4)
4. **Machine Learning for Control**: RL-based controllers (covered in Chapter 6)
5. **Custom DDS Implementations**: Only FastDDS and CycloneDDS
6. **Real Robot Hardware Integration**: Physical servo control (covered in Chapter 5)
7. **Multi-Robot Coordination**: Swarm robotics (out of book scope)
8. **ROS 2 Security**: SROS2 and encryption (optional advanced topic)
9. **Video Lectures**: Text and interactive components only
10. **Live Virtual Labs**: Asynchronous learning only (no scheduled sessions)

### Future Considerations
- ROS 2 Iron/Jazzy migration guide (appendix)
- Windows WSL2 setup guide (supplementary material)
- Advanced control methods (Model Predictive Control, LQR)
- Integration with Chapter 3 (vision-based control loops)

---

## Assumptions

1. **User has completed Chapter 1** and understands basic robotics concepts
2. **User has Ubuntu 22.04 installed** (dual-boot, VM, or WSL2)
3. **User has basic Linux command-line skills** (cd, ls, mkdir, nano/vim)
4. **User has Python 3.10+ and C++ 17 compiler** (comes with Ubuntu 22.04)
5. **User has stable internet connection** for package downloads (2+ Mbps)
6. **User has 20GB free disk space** for ROS 2 and simulation environments
7. **User's GPU supports OpenGL 3.3+** for 3D visualizations
8. **User is willing to spend 8-12 hours** on Chapter 2
9. **Jetson hardware is optional** - cloud/simulation alternatives exist
10. **User is familiar with version control** (git basics for code submission)

---

## Detailed Lesson Breakdown

### Lesson 2.1: ROS 2 Fundamentals - The Robot Middleware

**Learning Objectives:**
- Understand ROS 2 architecture and DDS layer
- Install and configure ROS 2 Humble
- Create publisher and subscriber nodes in Python and C++
- Use ROS 2 CLI tools for debugging

**Time Estimates:**
- Reading: 35 minutes
- Hands-on coding: 75 minutes
- Quiz: 15 minutes
- **Total: 125 minutes (2 hours)**

**Content Outline:**
1. Introduction to Robot Middleware (5 min)
   - Why ROS? Evolution from ROS 1 to ROS 2
   - Real-world use cases (Tesla, Boston Dynamics, NASA)

2. ROS 2 Architecture Deep Dive (15 min)
   - Nodes: Independent processes
   - Topics: Publish-subscribe messaging
   - Services: Request-response RPC
   - Actions: Long-running tasks with feedback
   - Parameters: Runtime configuration

3. DDS Layer Explained (10 min)
   - What is DDS (Data Distribution Service)?
   - QoS (Quality of Service) policies
   - Discovery mechanism

4. Installation Guide (5 min reading, 30 min hands-on)
   - Step-by-step ROS 2 Humble installation
   - Workspace setup (colcon build system)
   - Environment configuration

5. Your First ROS 2 Nodes (45 min hands-on)
   - Python talker/listener example
   - C++ talker/listener example
   - Custom message creation
   - Launching nodes with launch files

6. ROS 2 CLI Mastery (10 min)
   - ros2 node, topic, service, action commands
   - Introspection and debugging
   - Recording and playback with ros2 bag

**Diagrams:**
- ROS 2 Architecture Diagram (Nodes, Topics, Services, Actions)
- DDS Discovery Process Flowchart
- QoS Compatibility Matrix

**Code Examples:**
1. Python publisher (talker.py)
2. Python subscriber (listener.py)
3. C++ publisher (talker.cpp)
4. C++ subscriber (listener.cpp)
5. Custom message definition (.msg file)
6. Launch file example (launch.py)

**Interactive Component:**
- ROS 2 Node Visualizer (see specs below)

**Quiz Topics:**
- ROS 2 vs ROS 1 differences
- Node communication patterns
- QoS policies
- CLI tool usage

---

### Lesson 2.2: Humanoid Modeling with URDF/SDF

**Learning Objectives:**
- Understand URDF syntax for robot description
- Create links, joints, and kinematic chains
- Add visual and collision meshes
- Compute forward and inverse kinematics

**Time Estimates:**
- Reading: 40 minutes
- Hands-on modeling: 85 minutes
- Quiz: 15 minutes
- **Total: 140 minutes (2.3 hours)**

**Content Outline:**
1. Robot Description Formats (5 min)
   - URDF vs SDF vs MJCF
   - When to use each format

2. URDF Fundamentals (15 min)
   - XML structure
   - Links: rigid bodies with inertia
   - Joints: connections with DOF
   - Gazebo-specific extensions

3. Building a Humanoid Step-by-Step (20 min reading, 60 min hands-on)
   - Torso and pelvis
   - Legs (hip, knee, ankle joints)
   - Arms (shoulder, elbow, wrist)
   - Head and sensors

4. Meshes and Visualization (10 min reading, 25 min hands-on)
   - Visual vs collision geometry
   - Mesh file formats (STL, DAE, OBJ)
   - Material properties

5. Kinematics Theory (15 min)
   - Forward kinematics: Joint angles → End-effector pose
   - Inverse kinematics: End-effector pose → Joint angles
   - Denavit-Hartenberg parameters

6. Testing in RVIZ2 (hands-on)
   - Loading URDF in RVIZ2
   - Joint state publisher GUI
   - Debugging transform trees

**Diagrams:**
- URDF Link-Joint Hierarchy
- Humanoid Kinematic Chain
- Forward Kinematics Example
- Coordinate Frame Transformations

**Code Examples:**
1. Simple 2-link robot URDF
2. 12-DOF humanoid URDF
3. Gazebo plugin integration
4. Python FK solver
5. Python IK solver (analytical or numerical)

**Interactive Component:**
- Web-based URDF Editor with 3D Preview (see specs below)

**Quiz Topics:**
- URDF syntax and structure
- Joint types (revolute, prismatic, fixed)
- Kinematics problem-solving
- Transform tree debugging

---

### Lesson 2.3: Control Theory for Bipedal Locomotion

**Learning Objectives:**
- Implement PID controllers for joint control
- Understand Zero Moment Point (ZMP) for stability
- Generate walking gaits
- Use IMU feedback for balance

**Time Estimates:**
- Reading: 45 minutes
- Hands-on implementation: 90 minutes
- Quiz: 15 minutes
- **Total: 150 minutes (2.5 hours)**

**Content Outline:**
1. Control Theory Primer (10 min)
   - Open-loop vs closed-loop control
   - Feedback systems
   - Stability criteria

2. PID Control Deep Dive (20 min reading, 30 min hands-on)
   - Proportional, Integral, Derivative terms
   - Tuning methods (Ziegler-Nichols, manual)
   - Anti-windup mechanisms
   - Implementation in ROS 2

3. Bipedal Stability (15 min)
   - Center of Mass (CoM) and Center of Pressure (CoP)
   - Zero Moment Point (ZMP) criterion
   - Static vs dynamic stability

4. Gait Generation (15 min reading, 40 min hands-on)
   - Foot trajectory planning
   - Swing and stance phases
   - Timing and synchronization
   - Testing in Gazebo

5. Sensor Fusion for Balance (10 min reading, 20 min hands-on)
   - IMU data processing (accelerometer, gyro)
   - Complementary filter
   - Corrective torque calculation

6. Emergency Stop and Safety (5 min)
   - Fall detection
   - Safe shutdown procedures

**Diagrams:**
- PID Control Block Diagram
- Step Response Graphs (underdamped, overdamped, critically damped)
- ZMP Diagram (support polygon, CoP trajectory)
- Gait Cycle Phases

**Code Examples:**
1. PID controller class (Python)
2. PID controller class (C++)
3. ZMP calculator
4. Gait generator
5. IMU balance controller
6. Emergency stop node

**Interactive Component:**
- PID Controller Tuner (see specs below)

**Quiz Topics:**
- PID parameter effects
- ZMP stability conditions
- Gait phase transitions
- Sensor fusion concepts

---

### Lesson 2.4: Sim-to-Real Deployment Pipeline

**Learning Objectives:**
- Create ROS 2 packages with proper structure
- Cross-compile for ARM64 (Jetson)
- Monitor real-time performance
- Implement safety mechanisms

**Time Estimates:**
- Reading: 30 minutes
- Hands-on deployment: 80 minutes
- Quiz: 15 minutes
- **Total: 125 minutes (2 hours)**

**Content Outline:**
1. ROS 2 Package Structure (10 min)
   - CMakeLists.txt and package.xml
   - Python packages vs C++ packages
   - Dependencies and build types

2. Cross-Compilation for Jetson (15 min reading, 40 min hands-on)
   - Setting up cross-compiler
   - Building for ARM64
   - Transferring binaries
   - Alternative: Native compilation on Jetson

3. Real-Time Constraints (10 min)
   - Loop frequency requirements
   - Latency budgets
   - Thread priorities
   - PREEMPT_RT kernel (optional)

4. Performance Monitoring (5 min reading, 20 min hands-on)
   - CPU and memory usage
   - Message latency
   - Loop timing violations
   - Profiling tools

5. Deployment Workflow (20 min hands-on)
   - SSH connection to Jetson
   - Launching nodes remotely
   - Log aggregation
   - Auto-start on boot

6. Safety Mechanisms (10 min)
   - Watchdog timers
   - Emergency stop triggers
   - Graceful shutdown

**Diagrams:**
- Deployment Architecture (Dev Machine → Jetson → Robot)
- Real-Time Loop Timing Diagram
- Safety System State Machine

**Code Examples:**
1. CMakeLists.txt template
2. package.xml template
3. Cross-compilation script
4. Performance monitor node
5. Deployment script (rsync + ssh)
6. Safety watchdog node

**Interactive Component:**
- Deployment Dashboard (see specs below)

**Quiz Topics:**
- Package dependencies
- Cross-compilation process
- Real-time constraints
- Safety mechanisms

---

## Interactive Component Specifications

### Component 1: ROS 2 Node Visualizer

**Purpose**: Real-time visualization of ROS 2 node communication

**Features:**
- Display all running nodes as draggable boxes
- Show topics as lines connecting publishers to subscribers
- Color-code message types (sensor_msgs, geometry_msgs, etc.)
- Real-time message rate indicator (Hz)
- Click topic to view message content
- Inject test messages into topics

**Technical Stack:**
- Frontend: React + D3.js for graph layout
- Backend: ROS 2 bridge (rosbridge_suite) via WebSocket
- Message serialization: JSON

**Wireframe Description:**
```
+------------------------------------------+
|  ROS 2 Node Graph Visualizer             |
|                                          |
|  [/talker] ---> /chatter ---> [/listener]|
|     (10Hz)                        (10Hz) |
|                                          |
|  [/camera] ---> /image_raw ---> [/proc]  |
|     (30Hz)                        (30Hz) |
|                                          |
|  Sidebar:                                |
|  - Topic: /chatter                       |
|    Type: std_msgs/String                 |
|    Rate: 10 Hz                           |
|    [Inject Test Message]                 |
+------------------------------------------+
```

**API Requirements:**
- GET /api/ros2/nodes - List all active nodes
- GET /api/ros2/topics - List all topics with metadata
- WS /ws/ros2/graph - WebSocket for real-time updates
- POST /api/ros2/publish - Inject message into topic

---

### Component 2: Web-Based URDF Editor & 3D Viewer

**Purpose**: Create and visualize URDF models in the browser

**Features:**
- Code editor with URDF syntax highlighting
- Live validation with error messages
- 3D preview using Three.js
- Joint manipulation sliders
- Export URDF file
- Template library (biped, quadruped, arm)

**Technical Stack:**
- Frontend: React + Monaco Editor + Three.js
- URDF Parser: JavaScript XML parser
- 3D Rendering: Three.js with OrbitControls

**Wireframe Description:**
```
+------------------------------------------+
|  URDF Editor                | 3D Preview |
|  <robot name="humanoid">    |    ___     |
|    <link name="torso">      |   / | \    |
|      ...                    |  /  |  \   |
|    </link>                  | |   |   |  |
|    <joint name="hip_joint"> |  \  |  /   |
|      ...                    |   \ | /    |
|    </joint>                 |    ---     |
|  </robot>                   |            |
|                             | Torso Roll:|
|  [Validate] [Export]        | [========] |
|  ✓ No errors                |            |
+------------------------------------------+
```

**API Requirements:**
- POST /api/urdf/validate - Validate URDF syntax
- POST /api/urdf/parse - Parse URDF to JSON
- GET /api/urdf/templates - List URDF templates

---

### Component 3: PID Controller Tuner

**Purpose**: Interactive PID parameter tuning with real-time visualization

**Features:**
- Sliders for Kp, Ki, Kd parameters
- Step response graph
- Metrics display (rise time, overshoot, settling time)
- Preset configurations (underdamped, critically damped, overdamped)
- Export tuned parameters

**Technical Stack:**
- Frontend: React + Recharts
- Simulation: JavaScript PID simulation (client-side)

**Wireframe Description:**
```
+------------------------------------------+
|  PID Controller Tuner                    |
|                                          |
|  Kp: [==========] 1.5                    |
|  Ki: [====      ] 0.3                    |
|  Kd: [======    ] 0.5                    |
|                                          |
|  Step Response:                          |
|   ^                                      |
|   |     ____                             |
|   |   _/    \_                           |
|   | _/        \___                       |
|   +---------------> Time                 |
|                                          |
|  Rise Time: 0.8s  Overshoot: 15%         |
|  Settling Time: 2.3s                     |
|                                          |
|  [Presets: Critically Damped] [Export]   |
+------------------------------------------+
```

**API Requirements:**
- None (client-side simulation)
- Optional: POST /api/pid/simulate - Server-side simulation for complex systems

---

### Component 4: Deployment Dashboard

**Purpose**: Monitor hardware status and deploy ROS 2 nodes

**Features:**
- Hardware connection status (Jetson, sensors, actuators)
- CPU, memory, and network usage graphs
- ROS 2 node list with restart buttons
- Log viewer with filtering
- Deploy new code via file upload

**Technical Stack:**
- Frontend: React + Recharts
- Backend: WebSocket connection to Jetson
- Agent: Python script on Jetson publishing system metrics

**Wireframe Description:**
```
+------------------------------------------+
|  Deployment Dashboard                    |
|                                          |
|  Hardware Status:                        |
|  ✓ Jetson Orin (192.168.1.100)           |
|  ✓ IMU Sensor                            |
|  ✗ Camera (Disconnected)                 |
|                                          |
|  System Metrics:                         |
|  CPU: [=========  ] 82%                  |
|  RAM: [======    ] 65%                   |
|                                          |
|  Running Nodes:                          |
|  - /gait_controller [Restart]            |
|  - /imu_reader [Restart]                 |
|                                          |
|  Logs:                                   |
|  [INFO] Gait cycle completed             |
|  [WARN] IMU drift detected               |
|                                          |
|  [Upload New Code]                       |
+------------------------------------------+
```

**API Requirements:**
- WS /ws/deployment/status - Real-time status updates
- POST /api/deployment/upload - Upload and deploy code
- POST /api/deployment/restart - Restart specific node
- GET /api/deployment/logs - Fetch logs

---

## Assessment Rubrics

### Lesson Quizzes (10 questions each, 70% passing)

**Question Types:**
- Multiple Choice: 60%
- True/False: 20%
- Code Completion: 20%

**Grading:**
- Auto-graded immediately
- Unlimited attempts allowed
- Correct answers explained after submission

**Example Questions:**

**Lesson 2.1 Quiz:**
1. What is the default DDS implementation in ROS 2 Humble? (MC)
   - A) CycloneDDS
   - B) FastDDS ✓
   - C) RTI Connext
   - D) OpenSplice

2. True or False: ROS 2 topics use request-response communication. (T/F)
   - False ✓ (Topics use publish-subscribe)

3. Complete the code to create a publisher:
   ```python
   self.publisher_ = self.create_publisher(String, 'topic', ____)
   ```
   Answer: `10` (queue size)

---

### Practical Assignment: Create a ROS 2 Package (100 points)

**Objective**: Create a ROS 2 package with a custom message, publisher, and subscriber.

**Requirements:**
1. Package name: `student_controller`
2. Custom message: `JointCommand.msg` with fields `joint_name` (string) and `position` (float64)
3. Publisher node: `joint_commander.py` publishing at 10Hz
4. Subscriber node: `joint_listener.py` logging received commands
5. Launch file: `demo.launch.py` starting both nodes

**Rubric:**

| Criteria | Points | Description |
|----------|--------|-------------|
| Package Structure | 20 | Correct CMakeLists.txt and package.xml |
| Custom Message | 20 | JointCommand.msg with correct fields |
| Publisher Implementation | 20 | Publishes valid messages at 10Hz |
| Subscriber Implementation | 20 | Logs messages correctly |
| Launch File | 10 | Starts both nodes successfully |
| Code Quality | 10 | Follows ROS 2 conventions, comments |
| **Total** | **100** | |

**Auto-Grading Tests:**
- Test 1: Package builds without errors (20 pts)
- Test 2: Message definition is valid (20 pts)
- Test 3: Publisher node starts and publishes (20 pts)
- Test 4: Subscriber node receives messages (20 pts)
- Test 5: Launch file runs without errors (10 pts)
- Test 6: Code passes linter (10 pts)

**Submission**: GitHub repository link

---

### Capstone Project: Implement a Balance Controller (200 points)

**Objective**: Implement a controller that keeps a humanoid robot balanced using IMU feedback.

**Requirements:**
1. URDF model of a simple bipedal robot (2 legs, 6 DOF)
2. PID controller for ankle joints
3. IMU sensor simulation in Gazebo
4. Balance recovery when robot is pushed
5. Demonstration video showing successful balance

**Rubric:**

| Criteria | Points | Description |
|----------|--------|-------------|
| URDF Model | 30 | Correct links, joints, and inertias |
| PID Implementation | 40 | Properly tuned controller |
| IMU Integration | 30 | Reads IMU data and processes |
| Balance Performance | 50 | Robot recovers from 15° tilt in <3s |
| Code Documentation | 20 | Clear comments and README |
| Video Demo | 30 | Shows successful balance recovery |
| **Total** | **200** | |

**Auto-Grading Tests:**
- Test 1: URDF loads in Gazebo (30 pts)
- Test 2: PID controller runs without crashes (20 pts)
- Test 3: IMU data is read correctly (20 pts)
- Test 4: Robot stays upright for 30 seconds (30 pts)
- Test 5: Robot recovers from push test (50 pts)

**Manual Review:**
- Code quality and documentation (20 pts)
- Video demonstration quality (30 pts)

**Submission**: GitHub repository + YouTube/Loom video link

---

### Peer Review System (50 points)

**Objective**: Review 2 peer submissions and provide constructive feedback.

**Requirements:**
1. Review 2 randomly assigned capstone projects
2. Provide at least 100 words of feedback per submission
3. Rate on 5 criteria (each 1-5 stars)

**Criteria for Peer Review:**
- Code Quality
- Documentation Clarity
- Problem Solving Approach
- Creativity
- Overall Impression

**Rubric for Reviewer:**

| Criteria | Points | Description |
|----------|--------|-------------|
| Completion | 20 | Reviewed 2 submissions |
| Feedback Quality | 20 | Constructive, specific comments |
| Fairness | 10 | Ratings are reasonable |
| **Total** | **50** | |

**Protection Against Abuse:**
- AI-flagged reviews for plagiarism or inappropriate content
- Instructor override for suspicious ratings
- Minimum word count enforced

---

## Integration Checklist

### Integration with Chapter 1
- [ ] Reference sensor types from Chapter 1.3 (IMU, cameras)
- [ ] Connect to hardware landscape (Jetson, servos)
- [ ] Build on embodied intelligence concepts
- [ ] Use terminology established in Chapter 1 glossary

### Integration with Authentication System
- [ ] Track quiz attempts and scores per user
- [ ] Save progress (lesson completion, code submissions)
- [ ] Personalize based on user's hardware profile
- [ ] Show dashboard with Chapter 2 progress

### Integration with Personalization
- [ ] Adapt code examples to user's robot (Jetson vs Cloud)
- [ ] Filter content by expertise level (Beginner/Intermediate/Expert)
- [ ] Suggest deployment target based on hardware profile
- [ ] Customize URDF templates

### Integration with RAG Chatbot
- [ ] Train on ROS 2 official documentation
- [ ] Index all Chapter 2 code examples
- [ ] Answer URDF debugging questions
- [ ] Provide control theory explanations

### Integration with Chapter 3 (Future)
- [ ] Chapter 2.4 prepares for vision-based control (Chapter 3)
- [ ] URDF models include camera sensors for Chapter 3
- [ ] ROS 2 skills transfer to vision pipelines

### Technical Integration
- [ ] All components use same authentication context
- [ ] Consistent API structure across interactive features
- [ ] Shared UI components (buttons, forms, cards)
- [ ] Unified error handling and logging

---

## Technical Architecture

### Real-Time Features Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React App)               │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Node Viz     │  │ URDF Editor              │ │
│  │ (D3.js)      │  │ (Monaco + Three.js)      │ │
│  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ PID Tuner    │  │ Deployment Dashboard     │ │
│  │ (Recharts)   │  │ (WebSocket)              │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
                       │
                       │ WebSocket / REST API
                       │
┌─────────────────────────────────────────────────┐
│           Backend (Node.js / FastAPI)           │
│  ┌──────────────────────────────────────────┐   │
│  │  ROS 2 Bridge (rosbridge_suite)          │   │
│  │  - WebSocket handler                     │   │
│  │  - Topic publisher/subscriber            │   │
│  │  - Service/Action clients                │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  URDF Parser & Validator                 │   │
│  │  - XML schema validation                 │   │
│  │  - Transform tree computation            │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Deployment Agent Interface              │   │
│  │  - SSH connection to Jetson              │   │
│  │  - Metrics aggregation                   │   │
│  │  - Code deployment                       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                       │
                       │ ROS 2 DDS / SSH
                       │
┌─────────────────────────────────────────────────┐
│        Edge Hardware (Jetson Orin)              │
│  ┌──────────────────────────────────────────┐   │
│  │  ROS 2 Nodes (Controllers, Sensors)      │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Deployment Agent (Python)               │   │
│  │  - System metrics publisher              │   │
│  │  - Node management API                   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **ROS 2 Node Visualizer:**
   - Frontend requests node list via WebSocket
   - rosbridge_suite queries ROS 2 graph
   - Updates pushed to frontend every 500ms

2. **URDF Editor:**
   - User edits XML in Monaco editor
   - On change, XML sent to backend for validation
   - Parsed URDF returned as JSON
   - Three.js renders 3D model from JSON

3. **PID Tuner:**
   - All simulation runs client-side (no backend)
   - Parameters changed via sliders trigger re-simulation
   - Graph updated in real-time

4. **Deployment Dashboard:**
   - WebSocket connection to Jetson agent
   - Agent publishes metrics every 1 second
   - Frontend displays metrics and logs
   - Code upload via HTTP POST with multipart/form-data

---

## Wireframes (Text-Based)

### Lesson 2.1 Page Layout

```
+-----------------------------------------------------+
|  [Logo] Physical AI Textbook          [User Menu]  |
+-----------------------------------------------------+
|  Chapter 2 > Lesson 2.1: ROS 2 Fundamentals         |
+-----------------------------------------------------+
|  Progress: [===========            ] 60%            |
+-----------------------------------------------------+
|                                                     |
|  # ROS 2 Fundamentals - The Robot Middleware        |
|                                                     |
|  [Reading Time: 35 min] [Coding: 75 min]            |
|                                                     |
|  ## Learning Objectives                             |
|  - Understand ROS 2 architecture...                 |
|  - Install and configure...                         |
|  ...                                                |
|                                                     |
|  ## Introduction to Robot Middleware                |
|  Lorem ipsum dolor sit amet...                      |
|                                                     |
|  [Diagram: ROS 2 Architecture]                      |
|                                                     |
|  ## Installation Guide                              |
|  ```bash                                            |
|  sudo apt install ros-humble-desktop                |
|  ```                                                |
|  [Copy Code]                                        |
|                                                     |
|  > 💡 AI Agent Note:                                |
|  > Always source setup.bash in every terminal!      |
|                                                     |
|  --- Interactive Component ---                      |
|  [ROS 2 Node Visualizer - Click to Launch]          |
|                                                     |
|  ## Quiz                                            |
|  Ready to test your knowledge?                      |
|  [Take Quiz →]                                      |
|                                                     |
|  [< Previous Lesson]      [Next Lesson: URDF →]     |
+-----------------------------------------------------+
|  Footer: © 2025 Physical AI Textbook                |
+-----------------------------------------------------+
```

---

This specification provides a complete blueprint for Chapter 2 implementation. All requirements are testable, measurable, and aligned with the project's educational goals.

**Next Steps:**
1. Review and approve specification
2. Run `/sp.plan` to create implementation plan
3. Run `/sp.tasks` to generate actionable task list
4. Begin development phase

---

**Document Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Ready for Planning Phase
