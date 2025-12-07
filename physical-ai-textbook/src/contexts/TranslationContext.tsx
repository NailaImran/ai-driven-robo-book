import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface TranslationContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  isUrdu: boolean;
  isEnglish: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Translation dictionary - full Chapter 3 translations
export const translations: Record<Language, Record<string, any>> = {
  en: {
    // Chapter 3 Header
    'chapter-3-title': 'Chapter 3: Simulation & Digital Twins',
    'chapter-3-overview': 'Simulation & Digital Twins',
    'chapter-3-intro': 'Welcome to Chapter 3! In this chapter, you\'ll learn how to simulate humanoid robots across multiple platforms - from physics-accurate Gazebo simulations to photorealistic NVIDIA Isaac Sim environments.',

    // Lesson Navigation
    'lesson-3-1-title': 'Lesson 3.1: Physics Simulation with Gazebo',
    'lesson-3-2-title': 'Lesson 3.2: High-Fidelity Rendering with Unity',
    'lesson-3-3-title': 'Lesson 3.3: NVIDIA Isaac Sim Platform',
    'lesson-3-4-title': 'Lesson 3.4: Sensor Simulation & Synthetic Data',
    'chapter-3-quiz-title': 'Assessment Quiz',

    // Learning Objectives
    'learning-objectives': 'Learning Objectives',
    'objective-1': 'Understand digital twin architecture and why simulation matters for robotics development',
    'objective-2': 'Create physics-based simulations using Gazebo with realistic joint control and collision detection',
    'objective-3': 'Build high-fidelity renderings using Unity and NVIDIA Isaac Sim for photorealistic visualization',
    'objective-4': 'Configure realistic sensors (LiDAR, depth cameras, IMUs) in simulation and interpret their outputs',
    'objective-5': 'Generate synthetic training data for machine learning models using domain randomization',
    'objective-6': 'Validate sim-to-real transfer and identify gaps between simulation and physical robots',

    // Prerequisites
    'prerequisites': 'Prerequisites',
    'prereq-1': 'Chapter 2: ROS 2 fundamentals, URDF modeling, and control theory',
    'prereq-2': 'Basic understanding of physics simulation concepts (gravity, friction, collision)',
    'prereq-3': 'Familiarity with coordinate transforms and 3D visualization',

    // Common UI
    'back-to-overview': 'Back to Chapter 3 Overview',
    'next-lesson': 'Next Lesson',
    'previous-lesson': 'Previous Lesson',
    'take-quiz': 'Take the Quiz',
    'view-answers': 'View Answer Key',
    'start-lesson': 'Start Lesson',
    'continue-lesson': 'Continue Lesson',

    // Personalization
    'expertise-level': 'Expertise Level',
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'show-detailed-explanations': 'Show Detailed Explanations',
    'show-advanced-content': 'Show Advanced Content',
    'hide-setup-instructions': 'Hide Setup Instructions',
    'show-research-papers': 'Show Research Papers',

    // Common sections
    'key-concepts': 'Key Concepts',
    'summary': 'Summary',
    'next-steps': 'Next Steps',
    'resources': 'Resources',
    'exercises': 'Hands-On Exercises',
    'validation-checklist': 'Validation Checklist',
    'estimated-time': 'Estimated Time',
    'what-youll-learn': 'What You\'ll Learn',
    'what-youll-build': 'What You\'ll Build',

    // Lesson 3.1 - Gazebo
    'lesson-3-1-subtitle': 'Physics Simulation with Gazebo',
    'gazebo-overview': 'Learn the fundamentals of physics-based robot simulation using Gazebo. You\'ll configure physics engines, import your Chapter 2 URDF models, and validate realistic motion behavior.',
    'gazebo-topics': 'Gazebo architecture and SDF format, Physics engines (ODE, Bullet, Simbody), Creating simulation worlds with obstacles, ROS 2-Gazebo integration, Stability and timestep tuning',
    'gazebo-build': 'A Gazebo world with a humanoid robot and obstacles, ROS 2 node to control robot joints via /cmd_vel, Visualization in RViz2 with TF2 transforms',

    // Lesson 3.2 - Unity
    'lesson-3-2-subtitle': 'High-Fidelity Rendering with Unity',
    'unity-overview': 'Create visually appealing robot simulations using Unity and the Robotics Hub. Bridge the gap between physics simulation and photorealistic rendering.',
    'unity-topics': 'Unity Robotics Hub and ROS-TCP-Connector, Importing and configuring 3D models, Material properties and PBR (Physically-Based Rendering), Lighting and camera setup for realistic visualization',
    'unity-build': 'A Unity scene with your Chapter 2 humanoid model, Real-time ROS 2 integration for live control, Photorealistic materials and lighting',

    // Lesson 3.3 - Isaac Sim
    'lesson-3-3-subtitle': 'NVIDIA Isaac Sim Platform',
    'isaac-overview': 'Master NVIDIA\'s advanced simulation platform for photorealistic rendering, reinforcement learning, and synthetic data generation.',
    'isaac-topics': 'Isaac Sim on NVIDIA Omniverse, Photorealistic rendering with RTX ray-tracing, Task graphs and reinforcement learning, Domain randomization for sim-to-real transfer',
    'isaac-build': 'A photorealistic humanoid simulation environment, ROS 2 bridge for real-time control, An RL task environment with customizable rewards',

    // Lesson 3.4 - Sensors
    'lesson-3-4-subtitle': 'Sensor Simulation & Synthetic Data',
    'sensors-overview': 'Learn how to simulate realistic sensors and generate large-scale labeled datasets for computer vision and perception models.',
    'sensors-topics': 'LiDAR point cloud simulation and noise models, RGB-D depth camera simulation with realistic artifacts, IMU (accelerometer, gyroscope) simulation, Domain randomization techniques',
    'sensors-build': 'A Gazebo world with multiple simulated sensors, Python pipeline to generate and validate sensor data, Synthetic dataset with 5000+ labeled images',

    // Interactive Components
    'interactive-components': 'Interactive Components',
    'gazebo-builder': 'Gazebo World Builder',
    'gazebo-builder-desc': 'Drag-and-drop interface to design simulation worlds without writing code.',
    'unity-preview': 'Unity Scene Preview',
    'unity-preview-desc': 'WebGL viewer to explore and interact with Unity scenes directly in your browser.',
    'isaac-designer': 'Isaac Sim Task Designer',
    'isaac-designer-desc': 'Visual UI for creating reinforcement learning tasks.',
    'sensor-visualizer': 'Sensor Data Visualizer',
    'sensor-visualizer-desc': 'Real-time 3D visualization of simulated sensor outputs.',

    // Code Examples
    'code-examples': 'Code Examples',
    'example-1-title': 'ROS 2 Humanoid Controller',
    'example-1-desc': 'Control a simulated humanoid robot using ROS 2 topics',
    'example-2-title': 'Unity ROS Integration',
    'example-2-desc': 'Real-time robot visualization and control in Unity',
    'example-3-title': 'Domain Randomization',
    'example-3-desc': 'Generate synthetic training data with parameter variation',
  },

  ur: {
    // Chapter 3 Header (Urdu)
    'chapter-3-title': 'باب 3: نقل اور ڈیجیٹل ٹوڑے',
    'chapter-3-overview': 'نقل اور ڈیجیٹل ٹوڑے',
    'chapter-3-intro': 'باب 3 میں خوش آمدید! اس باب میں، آپ متعدد پلیٹ فارمز پر انسان نما روبوٹس کی نقالی کرنا سیکھیں گے۔',

    // Lesson Navigation (Urdu)
    'lesson-3-1-title': 'درس 3.1: Gazebo کے ساتھ فزکس نقالی',
    'lesson-3-2-title': 'درس 3.2: Unity کے ساتھ اعلیٰ درجے کی رینڈرنگ',
    'lesson-3-3-title': 'درس 3.3: NVIDIA Isaac Sim پلیٹ فارم',
    'lesson-3-4-title': 'درس 3.4: سینسر نقالی اور مصنوعی ڈیٹا',
    'chapter-3-quiz-title': 'تشخیصی کوئز',

    // Learning Objectives (Urdu)
    'learning-objectives': 'سیکھنے کے مقاصد',
    'objective-1': 'ڈیجیٹل جڑواں فن تعمیر کو سمجھیں اور روبوٹکس میں نقالی کی اہمیت',
    'objective-2': 'Gazebo کے ذریعے فزکس پر مبنی نقالیاں بنائیں',
    'objective-3': 'Unity اور NVIDIA Isaac Sim کے ذریعے اعلیٰ فن تعمیری رینڈرنگ بنائیں',
    'objective-4': 'حقیقت پسندانہ سینسرز کو ترتیب دیں اور ان کی پیداوار کو سمجھیں',
    'objective-5': 'مشین لرننگ ماڈلز کے لیے مصنوعی ڈیٹا بنائیں',
    'objective-6': 'نقل سے حقیقت تک منتقلی کی تصدیق کریں',

    // Prerequisites (Urdu)
    'prerequisites': 'شرائط',
    'prereq-1': 'باب 2: ROS 2 کی بنیادی باتیں، URDF ماڈلنگ، اور کنٹرول تھیوری',
    'prereq-2': 'فزکس نقالی کے بنیادی تصورات کی سمجھ',
    'prereq-3': 'کوآرڈینیٹ تبدیلیوں سے واقفیت',

    // Common UI (Urdu)
    'back-to-overview': 'باب 3 کے جائزے پر واپس جائیں',
    'next-lesson': 'اگلا درس',
    'previous-lesson': 'پچھلا درس',
    'take-quiz': 'کوئز لیں',
    'view-answers': 'جوابات کی کلید دیکھیں',
    'start-lesson': 'درس شروع کریں',
    'continue-lesson': 'درس جاری رکھیں',

    // Personalization (Urdu)
    'expertise-level': 'مہارت کی سطح',
    'beginner': 'ابتدائی',
    'intermediate': 'درمیانہ',
    'advanced': 'اعلیٰ',
    'show-detailed-explanations': 'تفصیلی وضاحتیں دکھائیں',
    'show-advanced-content': 'اعلیٰ مواد دکھائیں',
    'hide-setup-instructions': 'سیٹ اپ کی ہدایات چھپائیں',
    'show-research-papers': 'تحقیقی مقالات دکھائیں',

    // Common sections (Urdu)
    'key-concepts': 'اہم تصورات',
    'summary': 'خلاصہ',
    'next-steps': 'اگلے قدم',
    'resources': 'وسائل',
    'exercises': 'عملی مشقیں',
    'validation-checklist': 'تصدیق کی فہرست',
    'estimated-time': 'متوقع وقت',
    'what-youll-learn': 'آپ کیا سیکھیں گے',
    'what-youll-build': 'آپ کیا بنائیں گے',

    // Lesson 3.1 - Gazebo (Urdu)
    'lesson-3-1-subtitle': 'Gazebo کے ساتھ فزکس نقالی',
    'gazebo-overview': 'Gazebo استعمال کرتے ہوئے فزکس پر مبنی روبوٹ نقالی کی بنیادی باتیں سیکھیں۔',
    'gazebo-topics': 'Gazebo فن تعمیر اور SDF فارمیٹ، فزکس انجن، نقالی کی دنیائیں، ROS 2 Gazebo انضمام',
    'gazebo-build': 'Gazebo دنیا ایک انسان نما روبوٹ اور رکاوٹوں کے ساتھ، ROS 2 نوڈ، RViz2 میں تصور',

    // Lesson 3.2 - Unity (Urdu)
    'lesson-3-2-subtitle': 'Unity کے ساتھ اعلیٰ درجے کی رینڈرنگ',
    'unity-overview': 'Unity اور Robotics Hub استعمال کرتے ہوئے بصری طور پر اپیل کرنے والی روبوٹ نقالیاں بنائیں۔',
    'unity-topics': 'Unity Robotics Hub اور ROS TCP Connector، 3D ماڈلز درآمد کریں، PBR مواد کی خصوصیات',
    'unity-build': 'Unity منظر آپ کے انسان نما ماڈل کے ساتھ، حقیقی وقت میں ROS 2 انضمام، فوٹو حقیقت پسندانہ مواد',

    // Lesson 3.3 - Isaac Sim (Urdu)
    'lesson-3-3-subtitle': 'NVIDIA Isaac Sim پلیٹ فارم',
    'isaac-overview': 'NVIDIA کے جدید نقالی پلیٹ فارم کو ماسٹر کریں۔',
    'isaac-topics': 'Isaac Sim NVIDIA Omniverse پر، RTX ray tracing کے ساتھ رینڈرنگ، تعلم کے کام',
    'isaac-build': 'فوٹو حقیقت پسندانہ نقالی ماحول، ROS 2 پل، تعلم کا ماحول',

    // Lesson 3.4 - Sensors (Urdu)
    'lesson-3-4-subtitle': 'سینسر نقالی اور مصنوعی ڈیٹا',
    'sensors-overview': 'حقیقت پسندانہ سینسرز کی نقالی کریں اور بڑے پیمانے پر لیبل شدہ ڈیٹاسیٹ بنائیں۔',
    'sensors-topics': 'LiDAR پوائنٹ کلاؤڈ نقالی، RGB-D گہرائی کیمرہ، IMU نقالی، ڈیٹا تبدیلی',
    'sensors-build': 'متعدد سینسرز کے ساتھ Gazebo دنیا، ڈیٹا تیاری کی لائن، مصنوعی ڈیٹاسیٹ',

    // Interactive Components (Urdu)
    'interactive-components': 'متحرک اجزاء',
    'gazebo-builder': 'Gazebo دنیا بنانے والا',
    'gazebo-builder-desc': 'نقالی کی دنیائیں ڈیزائن کریں کوڈ لکھے بغیر۔',
    'unity-preview': 'Unity منظر پیش نمائش',
    'unity-preview-desc': 'اپنے براؤزر میں Unity منظر کو دیکھیں اور استعمال کریں۔',
    'isaac-designer': 'Isaac Sim کام ڈیزائنر',
    'isaac-designer-desc': 'تعلم کے کاموں کو بصری طور پر بنائیں۔',
    'sensor-visualizer': 'سینسر ڈیٹا دیکھنے والا',
    'sensor-visualizer-desc': '3D میں سینسر پیداوار کو دیکھیں۔',

    // Code Examples (Urdu)
    'code-examples': 'کوڈ کی مثالیں',
    'example-1-title': 'ROS 2 انسان نما کنٹرولر',
    'example-1-desc': 'ROS 2 موضوعات کے ذریعے روبوٹ کو کنٹرول کریں',
    'example-2-title': 'Unity ROS انضمام',
    'example-2-desc': 'Unity میں حقیقی وقت میں روبوٹ کو دیکھیں اور کنٹرول کریں',
    'example-3-title': 'ڈیٹا تبدیلی',
    'example-3-desc': 'مصنوعی ڈیٹا بنائیں اختلافات کے ساتھ',
  }
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to English (with SSR safety check)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-language');
      return (saved as Language) || 'en';
    }
    return 'en';
  });

  // Save to localStorage when language changes (with SSR safety check)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(language === 'en' ? 'ur' : 'en');
  };

  /**
   * Translation function
   * @param key - The translation key (e.g., 'chapter-3-title')
   * @param defaultValue - Default value if key not found
   * @returns Translated string
   */
  const t = (key: string, defaultValue: string = key): string => {
    try {
      const translated = translations[language]?.[key];
      return translated || translations['en'][key] || defaultValue;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return defaultValue;
    }
  };

  const value: TranslationContextType = {
    language,
    toggleLanguage,
    setLanguage,
    t,
    isUrdu: language === 'ur',
    isEnglish: language === 'en'
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

/**
 * Helper component for rendering translated text
 */
interface TranslatedTextProps {
  tKey: string;
  defaultValue?: string;
  className?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  tKey,
  defaultValue,
  className
}) => {
  const { t } = useTranslation();
  return <span className={className}>{t(tKey, defaultValue)}</span>;
};

/**
 * Helper component for conditional rendering based on language
 */
interface LanguageSpecificProps {
  language: Language;
  children: ReactNode;
}

export const LanguageSpecific: React.FC<LanguageSpecificProps> = ({
  language: targetLanguage,
  children
}) => {
  const { language } = useTranslation();
  return language === targetLanguage ? <>{children}</> : null;
};
