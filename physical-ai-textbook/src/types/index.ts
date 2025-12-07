// Timeline Component Types
export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'industrial' | 'research' | 'commercial' | 'milestone';
  imageUrl?: string;
  sourceUrl?: string;
}

// Hardware Selector Types
export interface HardwareSpec {
  componentId: string;
  category: 'compute' | 'sensor' | 'actuator' | 'communication' | 'power';
  name: string;
  manufacturer: string;
  specs: {
    [key: string]: string | number;
  };
  useCase: string[];
  price: number;
  availability: 'in-stock' | 'pre-order' | 'discontinued';
  purchaseLinks: string[];
}

export interface HardwareRecommendation {
  primary: HardwareSpec[];
  alternatives: HardwareSpec[][];
  totalCost: number;
  suitabilityScore: number;
  explanation: string;
}

// Cost Calculator Types
export interface CostModel {
  setupType: 'on-premise' | 'cloud' | 'hybrid';
  capex: number;
  opexMonthly: number;
  components: {
    name: string;
    cost: number;
    quantity: number;
  }[];
  assumptions: string[];
}

export interface CostCalculation {
  setupType: string;
  timeframeYears: number;
  usageHoursPerWeek: number;
  totalCost: number;
  monthlyCost: number;
  breakEvenMonth?: number;
}

// Section and Content Types
export interface Section {
  id: string;
  title: string;
  sidebarPosition: number;
  estimatedReadingTime: number; // in minutes
  keywords: string[];
  learningObjectives: string[];
  prerequisites: string[];
}

export interface Diagram {
  id: string;
  title: string;
  type: 'mermaid' | 'svg' | 'image';
  source: string;
  altText: string;
  caption?: string;
}

export interface CodeExample {
  id: string;
  language: 'python' | 'bash' | 'typescript' | 'cpp';
  filename: string;
  code: string;
  description: string;
  expectedOutput?: string;
  executionInstructions: string[];
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedSection: string;
}

// User Progress Types (for future personalization)
export interface UserProgress {
  userId: string;
  completedSections: string[];
  quizScores: {
    [quizId: string]: number;
  };
  lastAccessed: Date;
  bookmarkedSections: string[];
}

// User Profile and Authentication Types
export interface UserBackground {
  // Software Experience
  pythonExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  cppExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  rosExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  softwareProjects: number; // count of projects completed

  // Hardware Experience
  roboticsExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  hardwareProjects: number; // count of hardware projects
  familiarHardware: string[]; // e.g., ['Arduino', 'Raspberry Pi', 'Jetson', 'ROS compatible sensors']

  // Learning Goals
  learningGoals: string[]; // e.g., ['bipedal walking', 'control theory', 'path planning', 'hardware integration']
  currentRole: 'student' | 'researcher' | 'hobbyist' | 'professional' | 'other';

  // Platform Preferences
  preferredLanguage: 'python' | 'cpp' | 'both';
  learningPace: 'slow' | 'moderate' | 'fast';
}

export interface User {
  id: string;
  name: string;
  email: string;
  background?: UserBackground;
  preferences?: {
    expertise: 'beginner' | 'intermediate' | 'advanced';
    [key: string]: any;
  };
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}
