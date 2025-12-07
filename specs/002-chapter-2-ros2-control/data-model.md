# Data Model: Chapter 2 Entities

**Date**: 2025-12-06
**Phase**: 1 (Design)
**Purpose**: Define data structures, relationships, validation rules, and state transitions for Chapter 2

---

## Entity Overview

Chapter 2 introduces 7 primary entities extracted from the specification:

1. **Lesson** - Educational content units (4 lessons total)
2. **CodeExample** - Executable Python/C++ snippets
3. **URDFModel** - Robot description files
4. **ControlAlgorithm** - PID/ZMP implementations
5. **Quiz** - Assessment instruments
6. **Assessment** - User submissions (quizzes, assignments, projects)
7. **HardwareProfile** - User's deployment target configuration

---

## Entity 1: Lesson

### Description
A lesson is a complete learning module within Chapter 2, containing reading material, code examples, diagrams, and a quiz.

### Schema

```typescript
interface Lesson {
  // Identifiers
  id: string;                // Format: "lesson-2-{1-4}"
  chapterId: string;         // Always "chapter-2" for this feature
  number: number;            // 1, 2, 3, or 4

  // Metadata
  title: string;             // e.g., "ROS 2 Fundamentals"
  slug: string;              // URL-friendly: "ros2-fundamentals"
  description: string;       // 1-2 sentence summary
  keywords: string[];        // For RAG indexing

  // Time Estimates
  readingTime: number;       // Minutes (30-45 per spec)
  codingTime: number;        // Minutes (60-90 per spec)
  totalTime: number;         // Computed: readingTime + codingTime

  // Content
  content: string;           // MDX markdown content
  learningObjectives: string[];  // Bullet points
  prerequisites: string[];   // Links to prior lessons/concepts

  // Assets
  diagrams: Diagram[];       // Embedded diagrams
  codeExamples: CodeExample[];  // Embedded code snippets
  urdfModels: URDFModel[];   // For Lesson 2.2 only

  // Assessment
  quiz: Quiz;                // End-of-lesson quiz

  // Interactive Component (optional)
  interactiveComponent?: {
    type: "NodeVisualizer" | "URDFEditor" | "PIDTuner" | "DeploymentDashboard";
    config: Record<string, any>;  // Component-specific props
  };
}

interface Diagram {
  id: string;
  title: string;
  altText: string;          // Accessibility (FR-C2-028)
  filePath: string;         // Path in /assets/diagrams/
  caption?: string;
}
```

### Relationships

- **belongsTo**: Chapter (1:1)
- **hasMany**: CodeExample (1:N)
- **hasMany**: Diagram (1:N)
- **hasOne**: Quiz (1:1)
- **hasMany**: URDFModel (1:N, Lesson 2.2 only)

### Validation Rules

```typescript
const lessonValidation = {
  readingTime: {
    min: 30,
    max: 45,
    message: "Reading time must be 30-45 minutes (spec requirement)"
  },
  codingTime: {
    min: 60,
    max: 90,
    message: "Coding time must be 60-90 minutes (spec requirement)"
  },
  content: {
    minWords: 2000,
    message: "Content must be at least 2000 words"
  },
  diagrams: {
    min: 3,
    message: "Each lesson requires 3+ diagrams (FR-C2-005)"
  },
  codeExamples: {
    min: 3,
    message: "Each lesson requires 3+ code examples (Constitution II)"
  }
};
```

### State Transitions

```
[NOT_STARTED] → (user opens lesson) → [IN_PROGRESS]
[IN_PROGRESS] → (user completes quiz with 70%+) → [COMPLETED]
[IN_PROGRESS] → (user leaves without quiz) → [IN_PROGRESS]
[COMPLETED] → (immutable, can revisit but stays COMPLETED)
```

### Example Instance

```json
{
  "id": "lesson-2-1",
  "chapterId": "chapter-2",
  "number": 1,
  "title": "ROS 2 Fundamentals",
  "slug": "ros2-fundamentals",
  "description": "Learn ROS 2 architecture, install Humble, and create your first nodes.",
  "keywords": ["ros2", "humble", "nodes", "topics", "dds"],
  "readingTime": 35,
  "codingTime": 75,
  "totalTime": 110,
  "content": "# ROS 2 Fundamentals\n\n## Learning Objectives...",
  "learningObjectives": [
    "Understand ROS 2 architecture and DDS layer",
    "Install and configure ROS 2 Humble",
    "Create publisher and subscriber nodes"
  ],
  "prerequisites": ["chapter-1/hardware-landscape"],
  "diagrams": [
    {
      "id": "ros2-architecture",
      "title": "ROS 2 Architecture",
      "altText": "Diagram showing nodes, topics, services, and actions",
      "filePath": "/assets/diagrams/ros2-architecture.svg"
    }
  ],
  "codeExamples": [...],
  "quiz": {...},
  "interactiveComponent": {
    "type": "NodeVisualizer",
    "config": {
      "demoNodes": ["talker", "listener"],
      "demoTopics": ["/chatter"]
    }
  }
}
```

---

## Entity 2: CodeExample

### Description
An executable code snippet (Python or C++) embedded in lessons with dependencies and test cases.

### Schema

```typescript
interface CodeExample {
  // Identifiers
  id: string;                // Format: "code-2-{lesson}-{index}"
  lessonId: string;          // Parent lesson

  // Metadata
  title: string;             // e.g., "Simple Talker Node"
  description: string;       // What this code demonstrates
  language: "python" | "cpp";
  difficulty: "beginner" | "intermediate" | "advanced";

  // Code
  code: string;              // Actual source code
  filename: string;          // Suggested filename (e.g., "talker.py")

  // Dependencies
  rosPackages: string[];     // ROS 2 packages (e.g., ["rclpy", "std_msgs"])
  systemPackages: string[];  // apt packages (e.g., ["python3-pip"])
  pipPackages?: string[];    // Python dependencies (e.g., ["numpy==1.24.0"])

  // Execution
  runCommand?: string;       // How to run (e.g., "python3 talker.py")
  expectedOutput?: string;   // What success looks like
  testCases: TestCase[];     // For automated testing

  // Learning Metadata
  highlightLines?: number[]; // Lines to emphasize in explanation
  explanation?: string;      // Line-by-line walkthrough
}

interface TestCase {
  id: string;
  description: string;
  command: string;           // Test command to run
  expectedReturnCode: number;  // Usually 0
  timeout: number;           // Max seconds
}
```

### Relationships

- **belongsTo**: Lesson (N:1)
- **hasMany**: TestCase (1:N)

### Validation Rules

```typescript
const codeExampleValidation = {
  code: {
    minLines: 5,
    maxLines: 100,
    message: "Code examples should be 5-100 lines (Constitution II: minimal viable)"
  },
  rosPackages: {
    validate: (pkgs) => pkgs.every(p => p.startsWith("ros-humble-")),
    message: "ROS packages must be ROS 2 Humble compatible (FR-C2-003)"
  },
  testCases: {
    min: 1,
    message: "Code examples must have at least 1 test case (Constitution II)"
  }
};
```

### State Transitions

```
[CREATED] → (CI/CD runs tests) → [TESTED]
[TESTED] → (test passes) → [VALIDATED]
[TESTED] → (test fails) → [BROKEN]
[BROKEN] → (code fixed) → [TESTED]
```

### Example Instance

```json
{
  "id": "code-2-1-001",
  "lessonId": "lesson-2-1",
  "title": "Simple Talker Node",
  "description": "ROS 2 publisher that sends String messages",
  "language": "python",
  "difficulty": "beginner",
  "code": "import rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import String\n\nclass Talker(Node):\n    def __init__(self):\n        super().__init__('talker')\n        self.publisher_ = self.create_publisher(String, 'chatter', 10)\n        self.timer = self.create_timer(0.5, self.timer_callback)\n\n    def timer_callback(self):\n        msg = String()\n        msg.data = 'Hello ROS 2!'\n        self.publisher_.publish(msg)\n        self.get_logger().info(f'Publishing: {msg.data}')\n\ndef main(args=None):\n    rclpy.init(args=args)\n    talker = Talker()\n    rclpy.spin(talker)\n    talker.destroy_node()\n    rclpy.shutdown()\n",
  "filename": "talker.py",
  "rosPackages": ["ros-humble-rclpy", "ros-humble-std-msgs"],
  "systemPackages": [],
  "runCommand": "python3 talker.py",
  "expectedOutput": "Publishing: Hello ROS 2!",
  "testCases": [
    {
      "id": "test-talker-runs",
      "description": "Talker node starts without errors",
      "command": "timeout 5s python3 talker.py",
      "expectedReturnCode": 124,
      "timeout": 6
    }
  ],
  "highlightLines": [7, 13],
  "explanation": "Line 7 creates a publisher on /chatter topic. Line 13 publishes a String message every 500ms."
}
```

---

## Entity 3: URDFModel

### Description
A robot description in URDF format with associated meshes and kinematics information.

### Schema

```typescript
interface URDFModel {
  // Identifiers
  id: string;                // Format: "urdf-{name}"
  lessonId?: string;         // If tied to specific lesson

  // Metadata
  name: string;              // Robot name (matches URDF <robot name="">)
  description: string;       // What robot this represents
  complexity: "simple" | "moderate" | "complex";  // Based on link count

  // Content
  xmlContent: string;        // Full URDF XML
  filePath: string;          // Path to .urdf file in assets/

  // Structure
  links: Link[];
  joints: Joint[];

  // Assets
  visualMeshes: MeshAsset[];   // Appearance meshes
  collisionMeshes: MeshAsset[]; // Physics meshes

  // Validation
  validated: boolean;        // Passed check_urdf?
  validationErrors: string[];

  // Metadata for Editor
  thumbnail?: string;        // Preview image for template library
  isTemplate: boolean;       // Available in URDF Editor templates?
}

interface Link {
  name: string;
  visual?: {
    geometry: "box" | "cylinder" | "sphere" | "mesh";
    size?: number[];         // [x, y, z] for box
    radius?: number;         // For cylinder/sphere
    length?: number;         // For cylinder
    meshPath?: string;       // For mesh geometry
  };
  collision?: {
    geometry: "box" | "cylinder" | "sphere" | "mesh";
    // Same fields as visual
  };
  inertial?: {
    mass: number;            // kg
    inertia: {
      ixx: number; ixy: number; ixz: number;
      iyy: number; iyz: number; izz: number;
    };
  };
}

interface Joint {
  name: string;
  type: "revolute" | "continuous" | "prismatic" | "fixed" | "floating" | "planar";
  parent: string;            // Parent link name
  child: string;             // Child link name
  origin: {
    xyz: [number, number, number];
    rpy: [number, number, number];  // Roll, pitch, yaw
  };
  axis?: [number, number, number];  // For revolute/prismatic
  limit?: {
    lower: number;
    upper: number;
    effort: number;
    velocity: number;
  };
}

interface MeshAsset {
  filename: string;          // e.g., "arm_link.stl"
  filePath: string;          // Absolute path in assets/meshes/
  format: "stl" | "dae" | "obj";
  fileSize: number;          // Bytes (must be <5MB per NFR-C2-006)
}
```

### Relationships

- **belongsTo**: Lesson (optional, N:1)
- **hasMany**: Link (1:N)
- **hasMany**: Joint (1:N)
- **hasMany**: MeshAsset (1:N)

### Validation Rules

```typescript
const urdfModelValidation = {
  xmlContent: {
    validate: (xml) => xml.includes('<robot') && xml.includes('</robot>'),
    message: "URDF must be valid XML with <robot> root element"
  },
  links: {
    min: 2,
    message: "Robot must have at least 2 links (base + 1 moving part)"
  },
  joints: {
    validate: (joints, links) => {
      const linkNames = links.map(l => l.name);
      return joints.every(j => linkNames.includes(j.parent) && linkNames.includes(j.child));
    },
    message: "All joint parent/child must reference existing links"
  },
  inertial: {
    validate: (link) => link.inertial ? link.inertial.mass > 0 : true,
    message: "Link mass must be positive (physics constraint)"
  },
  meshFiles: {
    maxSize: 5 * 1024 * 1024,  // 5MB
    message: "Mesh files must be under 5MB (NFR-C2-006)"
  }
};
```

### State Transitions

```
[CREATED] → (user edits in URDFEditor) → [DRAFT]
[DRAFT] → (validation requested) → [VALIDATING]
[VALIDATING] → (check_urdf passes) → [VALID]
[VALIDATING] → (check_urdf fails) → [INVALID]
[INVALID] → (user fixes errors) → [DRAFT]
[VALID] → (user exports) → [EXPORTED]
```

### Example Instance

```json
{
  "id": "urdf-biped-simple",
  "lessonId": "lesson-2-2",
  "name": "simple_biped",
  "description": "2-leg bipedal robot with 6 DOF",
  "complexity": "simple",
  "xmlContent": "<?xml version=\"1.0\"?>\n<robot name=\"simple_biped\">...</robot>",
  "filePath": "/assets/urdf-models/simple_biped.urdf",
  "links": [
    {
      "name": "torso",
      "visual": {
        "geometry": "box",
        "size": [0.2, 0.3, 0.4]
      },
      "inertial": {
        "mass": 10.0,
        "inertia": {
          "ixx": 0.1, "ixy": 0, "ixz": 0,
          "iyy": 0.1, "iyz": 0, "izz": 0.1
        }
      }
    },
    {
      "name": "left_leg",
      "visual": {
        "geometry": "cylinder",
        "radius": 0.05,
        "length": 0.5
      },
      "inertial": {
        "mass": 2.0,
        "inertia": {...}
      }
    }
  ],
  "joints": [
    {
      "name": "left_hip",
      "type": "revolute",
      "parent": "torso",
      "child": "left_leg",
      "origin": {
        "xyz": [-0.1, 0, -0.2],
        "rpy": [0, 0, 0]
      },
      "axis": [0, 1, 0],
      "limit": {
        "lower": -1.57,
        "upper": 1.57,
        "effort": 100,
        "velocity": 2.0
      }
    }
  ],
  "visualMeshes": [],
  "collisionMeshes": [],
  "validated": true,
  "validationErrors": [],
  "isTemplate": true
}
```

---

## Entity 4: ControlAlgorithm

### Description
A control algorithm implementation (PID, ZMP, Gait) with parameters and simulation configuration.

### Schema

```typescript
interface ControlAlgorithm {
  // Identifiers
  id: string;                // Format: "control-{type}-{name}"
  lessonId: string;          // Usually lesson-2-3

  // Metadata
  name: string;              // e.g., "Joint Position PID Controller"
  type: "PID" | "ZMP" | "Gait" | "MPC" | "LQR";
  description: string;

  // Implementation
  language: "python" | "cpp" | "javascript";  // JS for client-side PID Tuner
  implementation: string;    // Source code

  // Parameters
  parameters: Parameter[];

  // Simulation
  simulationConfig: {
    systemModel?: string;    // Transfer function or state-space
    initialConditions?: Record<string, number>;
    timeStep: number;        // Simulation dt (seconds)
    duration: number;        // Total simulation time (seconds)
  };

  // Performance
  performanceMetrics?: {
    riseTime?: number;       // Seconds
    settlingTime?: number;   // Seconds
    overshoot?: number;      // Percentage
    steadyStateError?: number;
  };
}

interface Parameter {
  name: string;              // e.g., "Kp", "Ki", "Kd"
  type: "number" | "array" | "string";
  defaultValue: any;
  min?: number;
  max?: number;
  description: string;
}
```

### Relationships

- **belongsTo**: Lesson (N:1)
- **hasMany**: Parameter (1:N)

### Validation Rules

```typescript
const controlAlgorithmValidation = {
  parameters: {
    validate: (params, type) => {
      if (type === "PID") {
        const names = params.map(p => p.name);
        return names.includes("Kp") && names.includes("Ki") && names.includes("Kd");
      }
      return true;
    },
    message: "PID controller must have Kp, Ki, Kd parameters"
  },
  simulationConfig: {
    validate: (config) => config.timeStep > 0 && config.duration > 0,
    message: "Simulation timeStep and duration must be positive"
  },
  implementation: {
    validate: (code, type) => {
      if (type === "PID") {
        return code.includes("Kp") && code.includes("Ki") && code.includes("Kd");
      }
      return true;
    },
    message: "PID implementation must use Kp, Ki, Kd parameters"
  }
};
```

### Example Instance

```json
{
  "id": "control-pid-joint-position",
  "lessonId": "lesson-2-3",
  "name": "Joint Position PID Controller",
  "type": "PID",
  "description": "PID controller for tracking joint position setpoints",
  "language": "python",
  "implementation": "class PIDController:\n    def __init__(self, Kp, Ki, Kd):\n        self.Kp = Kp\n        self.Ki = Ki\n        self.Kd = Kd\n        self.integral = 0\n        self.prev_error = 0\n\n    def compute(self, setpoint, measurement, dt):\n        error = setpoint - measurement\n        self.integral += error * dt\n        derivative = (error - self.prev_error) / dt\n        output = self.Kp * error + self.Ki * self.integral + self.Kd * derivative\n        self.prev_error = error\n        return output\n",
  "parameters": [
    {
      "name": "Kp",
      "type": "number",
      "defaultValue": 1.0,
      "min": 0,
      "max": 10,
      "description": "Proportional gain"
    },
    {
      "name": "Ki",
      "type": "number",
      "defaultValue": 0.1,
      "min": 0,
      "max": 5,
      "description": "Integral gain"
    },
    {
      "name": "Kd",
      "type": "number",
      "defaultValue": 0.05,
      "min": 0,
      "max": 2,
      "description": "Derivative gain"
    }
  ],
  "simulationConfig": {
    "systemModel": "G(s) = 1 / (s^2 + 2*s + 1)",
    "initialConditions": {"position": 0, "velocity": 0},
    "timeStep": 0.01,
    "duration": 10
  },
  "performanceMetrics": {
    "riseTime": 0.8,
    "settlingTime": 2.3,
    "overshoot": 15,
    "steadyStateError": 0.01
  }
}
```

---

## Entity 5: Quiz

### Description
An assessment instrument with multiple-choice, true/false, and code completion questions.

### Schema

```typescript
interface Quiz {
  // Identifiers
  id: string;                // Format: "quiz-2-{lesson-number}"
  lessonId: string;

  // Metadata
  title: string;             // e.g., "Lesson 2.1 Quiz"
  description: string;

  // Configuration
  questions: Question[];
  passingScore: number;      // Percentage (70 per spec)
  timeLimit: number;         // Minutes (15 per spec)
  maxAttempts: number;       // Unlimited (-1) or specific count
  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  // Feedback
  showAnswersAfterSubmit: boolean;
  provideExplanations: boolean;
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "code-completion";
  questionText: string;
  points: number;            // Usually 1 point each

  // Multiple Choice / True-False
  options?: Option[];
  correctOptionIds?: string[];  // For multiple correct answers

  // Code Completion
  codeTemplate?: string;     // Code with blank ______
  correctCompletion?: string;

  // Feedback
  explanation: string;       // Why this answer is correct
  hint?: string;             // Optional hint for students
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}
```

### Relationships

- **belongsTo**: Lesson (1:1)
- **hasMany**: Question (1:N)
- **hasMany**: Assessment (1:N) - User attempts

### Validation Rules

```typescript
const quizValidation = {
  questions: {
    count: 10,
    message: "Each quiz must have exactly 10 questions (FR-C2-016)"
  },
  passingScore: {
    value: 70,
    message: "Passing score must be 70% (spec requirement)"
  },
  timeLimit: {
    value: 15,
    message: "Time limit should be 15 minutes (spec requirement)"
  },
  questionTypes: {
    validate: (questions) => {
      const types = questions.map(q => q.type);
      const mc = types.filter(t => t === "multiple-choice").length;
      const tf = types.filter(t => t === "true-false").length;
      const cc = types.filter(t => t === "code-completion").length;
      return mc === 6 && tf === 2 && cc === 2;  // 60%, 20%, 20% per spec
    },
    message: "Quiz must have 6 MC, 2 T/F, 2 code completion (spec requirement)"
  }
};
```

### Example Instance

```json
{
  "id": "quiz-2-1",
  "lessonId": "lesson-2-1",
  "title": "ROS 2 Fundamentals Quiz",
  "description": "Test your understanding of ROS 2 architecture and basic nodes",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "questionText": "What is the default DDS implementation in ROS 2 Humble?",
      "points": 1,
      "options": [
        {"id": "a", "text": "CycloneDDS", "isCorrect": false},
        {"id": "b", "text": "FastDDS", "isCorrect": true},
        {"id": "c", "text": "RTI Connext", "isCorrect": false},
        {"id": "d", "text": "OpenSplice", "isCorrect": false}
      ],
      "correctOptionIds": ["b"],
      "explanation": "FastDDS (formerly FastRTPS) is the default DDS implementation in ROS 2 Humble."
    },
    {
      "id": "q2",
      "type": "true-false",
      "questionText": "ROS 2 topics use request-response communication.",
      "points": 1,
      "options": [
        {"id": "true", "text": "True", "isCorrect": false},
        {"id": "false", "text": "False", "isCorrect": true}
      ],
      "correctOptionIds": ["false"],
      "explanation": "Topics use publish-subscribe communication. Services use request-response."
    },
    {
      "id": "q3",
      "type": "code-completion",
      "questionText": "Complete the code to create a publisher:\nself.publisher_ = self.create_publisher(String, 'topic', ____)",
      "points": 1,
      "codeTemplate": "self.publisher_ = self.create_publisher(String, 'topic', ____)",
      "correctCompletion": "10",
      "explanation": "The third argument is the queue size, typically 10 for simple publishers."
    }
  ],
  "passingScore": 70,
  "timeLimit": 15,
  "maxAttempts": -1,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "showAnswersAfterSubmit": true,
  "provideExplanations": true
}
```

---

## Entity 6: Assessment

### Description
A user's submission for a quiz, assignment, or capstone project with scoring and feedback.

### Schema

```typescript
interface Assessment {
  // Identifiers
  id: string;                // UUID
  userId: string;            // From AuthContext
  type: "quiz" | "assignment" | "project";

  // Reference
  quizId?: string;           // For quiz attempts
  assignmentId?: string;     // For assignments
  projectId?: string;        // For capstone

  // Submission
  submittedAt: Date;
  submission: Record<string, any>;  // Type-specific data

  // Scoring
  score?: number;            // Percentage (0-100)
  maxScore: number;          // Total possible points
  autoGraded: boolean;
  gradedAt?: Date;

  // Feedback
  feedback?: string;         // Instructor comments
  rubric?: RubricScore[];

  // Status
  status: "submitted" | "grading" | "graded" | "returned";
}

interface RubricScore {
  criterion: string;
  maxPoints: number;
  earnedPoints: number;
  feedback: string;
}

// Type-specific submission data
interface QuizSubmission {
  answers: Record<string, string | string[]>;  // questionId → answer
  timeSpent: number;         // Seconds
  attemptNumber: number;
}

interface AssignmentSubmission {
  githubRepoUrl: string;
  commitHash: string;
  testResults?: TestResult[];
}

interface ProjectSubmission {
  githubRepoUrl: string;
  videoUrl: string;          // YouTube/Loom demo
  documentationUrl?: string;
}

interface TestResult {
  testName: string;
  passed: boolean;
  output?: string;
  points: number;
}
```

### Relationships

- **belongsTo**: User (N:1)
- **belongsTo**: Quiz | Assignment | Project (N:1)
- **hasMany**: RubricScore (1:N)

### Validation Rules

```typescript
const assessmentValidation = {
  submission: {
    validate: (sub, type) => {
      if (type === "quiz") return sub.answers && sub.attemptNumber;
      if (type === "assignment") return sub.githubRepoUrl && sub.commitHash;
      if (type === "project") return sub.githubRepoUrl && sub.videoUrl;
      return false;
    },
    message: "Submission must contain required fields for assessment type"
  },
  score: {
    min: 0,
    max: 100,
    message: "Score must be 0-100 percentage"
  },
  githubRepoUrl: {
    validate: (url) => url.startsWith("https://github.com/"),
    message: "GitHub repo URL must be valid"
  }
};
```

### State Transitions

```
[SUBMITTED] → (auto-grading starts) → [GRADING]
[GRADING] → (tests complete) → [GRADED]
[GRADED] → (instructor adds feedback) → [RETURNED]
[RETURNED] → (immutable, student can view)
```

---

## Entity 7: HardwareProfile

### Description
User's hardware configuration determining deployment targets and personalized content.

### Schema

```typescript
interface HardwareProfile {
  // Identifiers
  id: string;
  userId: string;            // From AuthContext

  // Platform
  platform: "jetson" | "cloud" | "local" | "none";

  // Specifications (if Jetson)
  specs?: {
    model: "nano" | "xavier-nx" | "orin-nano" | "orin-nx" | "agx-orin";
    ram: number;             // GB
    storage: number;         // GB
    gpu: string;
  };

  // Network
  connectivity?: {
    hasPublicIP: boolean;
    behindFirewall: boolean;
    wifiOnly: boolean;
  };

  // Deployment Target
  deploymentTarget: "jetson" | "docker" | "cloud" | "simulation-only";

  // Preferences
  preferredOS?: "ubuntu-22.04" | "ubuntu-20.04" | "docker";
  preferredLanguage?: "python" | "cpp" | "both";
}
```

### Relationships

- **belongsTo**: User (1:1)

### Validation Rules

```typescript
const hardwareProfileValidation = {
  platform: {
    validate: (platform, specs) => {
      if (platform === "jetson") return specs && specs.model;
      return true;
    },
    message: "Jetson platform requires specs.model"
  },
  deploymentTarget: {
    validate: (target, platform) => {
      if (platform === "none") return target === "simulation-only";
      return true;
    },
    message: "Users with no hardware can only use simulation-only target"
  }
};
```

---

## Entity Relationships Diagram (Text)

```
User
├── hasOne: HardwareProfile
└── hasMany: Assessment

Chapter
└── hasMany: Lesson

Lesson
├── belongsTo: Chapter
├── hasMany: CodeExample
├── hasMany: Diagram
├── hasMany: URDFModel (Lesson 2.2)
├── hasOne: Quiz
└── hasOne: ControlAlgorithm (Lesson 2.3)

CodeExample
├── belongsTo: Lesson
└── hasMany: TestCase

URDFModel
├── belongsTo: Lesson (optional)
├── hasMany: Link
├── hasMany: Joint
└── hasMany: MeshAsset

ControlAlgorithm
├── belongsTo: Lesson
└── hasMany: Parameter

Quiz
├── belongsTo: Lesson
├── hasMany: Question
└── hasMany: Assessment (user attempts)

Assessment
├── belongsTo: User
├── belongsTo: Quiz | Assignment | Project
└── hasMany: RubricScore
```

---

## Storage Implementation

### LocalStorage (Client-Side)

Used for user progress and preferences:

```typescript
// Keys
const STORAGE_KEYS = {
  USER_AUTH: "physical-ai-auth",              // From existing AuthContext
  LESSON_PROGRESS: "chapter-2-lesson-progress",
  QUIZ_ATTEMPTS: "chapter-2-quiz-attempts",
  HARDWARE_PROFILE: "chapter-2-hardware-profile",
  URDF_DRAFTS: "chapter-2-urdf-drafts"
};

// Example data
localStorage.setItem("chapter-2-lesson-progress", JSON.stringify({
  "lesson-2-1": "completed",
  "lesson-2-2": "in_progress",
  "lesson-2-3": "not_started",
  "lesson-2-4": "not_started"
}));
```

### Static Files (Docusaurus Build)

MDX content, diagrams, code examples:
- `docs/chapter-2/*.md` - Lesson content
- `docs/chapter-2/assets/diagrams/*.svg` - Diagrams
- `docs/chapter-2/assets/code-examples/*.{py,cpp}` - Code snippets
- `docs/chapter-2/assets/urdf-models/*.urdf` - URDF files
- `docs/chapter-2/assets/meshes/*.{stl,dae,obj}` - 3D meshes

### Future: Database (RAG System)

When implementing RAG chatbot:
- **Neon Postgres**: Structured data (users, assessments, progress)
- **Qdrant**: Vector embeddings (lesson content, code examples for semantic search)

---

**Data Model Complete** ✅
**Next**: Create API contracts in `contracts/` directory

**Document Version**: 1.0
**Last Updated**: 2025-12-06
