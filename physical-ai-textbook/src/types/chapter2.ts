/**
 * Shared TypeScript types and interfaces for Chapter 2 components
 *
 * This file contains all common types used across Chapter 2 interactive components:
 * - Node Visualizer
 * - URDF Editor
 * - PID Tuner
 * - Deployment Dashboard
 *
 * Implementation: T013 (Phase 2: Foundational Components)
 */

// ====================
// ROS 2 Types
// ====================

export interface ROS2Node {
  id: string;
  name: string;
  namespace: string;
  publishers: string[]; // topic names
  subscribers: string[]; // topic names
  services: string[];
  position?: { x: number; y: number }; // for visualization
}

export interface ROS2Topic {
  name: string;
  type: string; // message type (e.g., 'std_msgs/String')
  publishers: string[]; // node ids
  subscribers: string[]; // node ids
  qos?: ROS2QoS;
}

export interface ROS2Message {
  topic: string;
  type: string;
  data: any;
  timestamp: number;
}

export interface ROS2QoS {
  history: 'keep_last' | 'keep_all';
  depth: number;
  reliability: 'best_effort' | 'reliable';
  durability: 'transient_local' | 'volatile';
}

export interface ROS2Service {
  name: string;
  type: string;
  provider: string; // node id
}

export interface ROS2GraphData {
  nodes: ROS2Node[];
  topics: ROS2Topic[];
  services: ROS2Service[];
}

// ====================
// URDF Types
// ====================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Transform {
  position: Vector3;
  orientation: Quaternion;
}

export interface URDFGeometry {
  type: 'box' | 'cylinder' | 'sphere' | 'mesh';
  // Box
  size?: Vector3;
  // Cylinder
  radius?: number;
  length?: number;
  // Mesh
  filename?: string;
  scale?: Vector3;
}

export interface URDFMaterial {
  name?: string;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  texture?: string;
}

export interface URDFVisual {
  name?: string;
  origin?: Transform;
  geometry: URDFGeometry;
  material?: URDFMaterial;
}

export interface URDFCollision {
  name?: string;
  origin?: Transform;
  geometry: URDFGeometry;
}

export interface URDFInertia {
  ixx: number;
  ixy: number;
  ixz: number;
  iyy: number;
  iyz: number;
  izz: number;
}

export interface URDFInertial {
  origin?: Transform;
  mass: number;
  inertia: URDFInertia;
}

export interface URDFLink {
  name: string;
  visual?: URDFVisual[];
  collision?: URDFCollision[];
  inertial?: URDFInertial;
}

export type JointType =
  | 'fixed'
  | 'revolute'
  | 'continuous'
  | 'prismatic'
  | 'floating'
  | 'planar';

export interface URDFJointLimits {
  lower: number;
  upper: number;
  effort: number;
  velocity: number;
}

export interface URDFJoint {
  name: string;
  type: JointType;
  parent: string; // link name
  child: string; // link name
  origin?: Transform;
  axis?: Vector3;
  limits?: URDFJointLimits;
  dynamics?: {
    damping: number;
    friction: number;
  };
}

export interface URDFRobot {
  name: string;
  links: URDFLink[];
  joints: URDFJoint[];
}

export interface URDFValidationError {
  type: 'error' | 'warning';
  message: string;
  line?: number;
  element?: string;
}

// ====================
// Control Theory Types
// ====================

export interface PIDGains {
  kp: number;
  ki: number;
  kd: number;
}

export interface PIDState {
  time: number;
  setpoint: number;
  processValue: number;
  error: number;
  integral: number;
  derivative: number;
  controlOutput: number;
}

export interface ControlPerformanceMetrics {
  overshoot: number; // percentage
  settlingTime: number; // seconds
  steadyStateError: number;
  riseTime: number; // seconds
  peakTime: number; // seconds
}

export interface ZMPPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GaitPattern {
  name: string;
  phases: GaitPhase[];
  cycleTime: number; // seconds
}

export interface GaitPhase {
  name: string;
  duration: number; // seconds
  leftFootZ: number; // height
  rightFootZ: number; // height
  comShift: { x: number; y: number }; // center of mass shift
}

export interface IMUData {
  timestamp: number;
  orientation: Quaternion;
  angularVelocity: Vector3;
  linearAcceleration: Vector3;
}

// ====================
// Deployment Types
// ====================

export interface HardwareProfile {
  id: string;
  name: string;
  type: 'jetson_nano' | 'jetson_xavier' | 'jetson_orin' | 'custom';
  specs: {
    cpu: string;
    ram: number; // GB
    gpu?: string;
    storage: number; // GB
  };
  ip: string;
  port: number;
  username: string;
}

export interface DeploymentStatus {
  hardwareId: string;
  connected: boolean;
  ros2Running: boolean;
  nodes: {
    name: string;
    status: 'running' | 'stopped' | 'error';
    pid?: number;
  }[];
  systemMetrics: SystemMetrics;
  lastUpdate: number;
}

export interface SystemMetrics {
  timestamp: number;
  cpu: {
    usage: number; // percentage
    temperature: number; // celsius
  };
  memory: {
    used: number; // MB
    total: number; // MB
    percentage: number;
  };
  gpu?: {
    usage: number; // percentage
    temperature: number; // celsius
    memory: {
      used: number; // MB
      total: number; // MB
    };
  };
  network: {
    bytesReceived: number;
    bytesSent: number;
    latency: number; // ms
  };
}

export interface DeploymentLog {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  node: string;
  message: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language: 'python' | 'cpp' | 'xml' | 'yaml';
}

// ====================
// User Progress Types
// ====================

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number; // 0-100
  timeSpent: number; // minutes
  lastAccessed: number; // timestamp
  completedSections: string[];
}

export interface QuizAttempt {
  quizId: string;
  lessonId: string;
  score: number; // 0-100
  answers: {
    questionId: string;
    answer: string | string[];
    correct: boolean;
  }[];
  timestamp: number;
  duration: number; // seconds
}

export interface AssignmentSubmission {
  assignmentId: string;
  lessonId: string;
  code: CodeFile[];
  submitted: number; // timestamp
  score?: number;
  feedback?: string;
}

export interface UserPreferences {
  language: 'en' | 'ur';
  expertiseLevel: 'beginner' | 'intermediate' | 'expert';
  theme: 'light' | 'dark';
  notifications: boolean;
}

// ====================
// Component State Types
// ====================

export interface ComponentError {
  message: string;
  code?: string;
  timestamp: number;
  recoverable: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ComponentError | null;
}
