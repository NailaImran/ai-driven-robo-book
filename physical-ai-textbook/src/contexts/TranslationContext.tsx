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

// Translation dictionary - Complete book translations (All Chapters)
export const translations: Record<Language, Record<string, any>> = {
  en: {
    // ========== CHAPTER 1: FOUNDATIONS ==========
    // Chapter 1 Header
    'chapter-1-title': 'Chapter 1: Foundations of Physical AI & Embodied Intelligence',
    'chapter-1-overview': 'Foundations of Physical AI & Embodied Intelligence',
    'chapter-1-intro': 'Welcome to the first chapter of our journey into Physical AI and Humanoid Robotics! In this chapter, you\'ll learn the foundations of embodied intelligence and the hardware landscape.',

    // Chapter 1 Lessons
    'lesson-1-1-title': 'Lesson 1.1: Introduction to Physical AI',
    'lesson-1-2-title': 'Lesson 1.2: Embodied Intelligence Theory',
    'lesson-1-3-title': 'Lesson 1.3: Hardware Landscape',
    'lesson-1-4-title': 'Lesson 1.4: Lab Setup Guide',
    'chapter-1-quiz-title': 'Chapter 1 Assessment Quiz',

    // ========== CHAPTER 2: ROS2 & CONTROL ==========
    // Chapter 2 Header
    'chapter-2-title': 'Chapter 2: ROS 2 Fundamentals & Control Theory',
    'chapter-2-overview': 'ROS 2 Fundamentals & Control Theory',
    'chapter-2-intro': 'Welcome to Chapter 2! In this chapter, you\'ll master ROS 2 fundamentals, URDF modeling, control theory, and robot deployment strategies.',

    // Chapter 2 Lessons
    'lesson-2-1-title': 'Lesson 2.1: ROS 2 Fundamentals',
    'lesson-2-2-title': 'Lesson 2.2: URDF Modeling',
    'lesson-2-3-title': 'Lesson 2.3: Control Theory',
    'lesson-2-4-title': 'Lesson 2.4: Deployment Strategies',
    'chapter-2-quiz-title': 'Chapter 2 Assessment Quiz',

    // ========== CHAPTER 3: SIMULATION ==========
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
    'By the end of this lesson, you will be able to:': 'By the end of this lesson, you will be able to:',
    'Understand Gazebo architecture': 'Understand Gazebo architecture - how worlds, models, plugins, and physics engines work together',
    'Write SDF files': 'Write SDF files - Simulation Description Format for defining robots and environments',
    'Configure physics engines': 'Configure physics engines - choose between ODE, Bullet, Simbody and tune timesteps',
    'Control robot joints': 'Control robot joints - actuate humanoid models via ROS 2 topics',
    'Detect collisions': 'Detect collisions - understand contact dynamics and material properties',
    'Visualize in RViz2': 'Visualize in RViz2 - display TF2 transforms, joint states, and sensor data',
    'Debug simulation issues': 'Debug simulation issues - diagnose instability, clipping, and performance problems',
    'ROS 2 Humble or Iron installed and working': 'ROS 2 Humble or Iron installed and working',
    'Gazebo Garden or Humble installed': 'Gazebo Garden or Humble installed (sudo apt install gazebo)',
    'gazebo-vs-real-robot': 'Gazebo vs. Your Real Robot',
    'Below is a comparison of Gazebo simulation vs. physical robots:': 'Below is a comparison of Gazebo simulation vs. physical robots:',
    'Key elements include physics configuration, models, links, and joints.': 'Key elements include physics configuration, models, links, and joints.',

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
    // ========== CHAPTER 1: FOUNDATIONS (URDU) ==========
    // Chapter 1 Header (Urdu)
    'chapter-1-title': 'باب 1: جسمانی AI اور جسمانی ذہانت کی بنیادیں',
    'chapter-1-overview': 'جسمانی AI اور جسمانی ذہانت کی بنیادیں',
    'chapter-1-intro': 'جسمانی AI اور انسان نما روبوٹکس کی ہماری سفر میں خوش آمدید! اس باب میں، آپ جسمانی ذہانت اور ہارڈ ویئر کی بنیادیں سیکھیں گے۔',

    // Chapter 1 Lessons (Urdu)
    'lesson-1-1-title': 'درس 1.1: جسمانی AI کا تعارف',
    'lesson-1-2-title': 'درس 1.2: جسمانی ذہانت کا نظریہ',
    'lesson-1-3-title': 'درس 1.3: ہارڈ ویئر منظر نامہ',
    'lesson-1-4-title': 'درس 1.4: لیب سیٹ اپ گائیڈ',
    'chapter-1-quiz-title': 'باب 1 کی تشخیص کوئز',

    // ========== CHAPTER 2: ROS2 & CONTROL (URDU) ==========
    // Chapter 2 Header (Urdu)
    'chapter-2-title': 'باب 2: ROS 2 کی بنیادیں اور کنٹرول تھیوری',
    'chapter-2-overview': 'ROS 2 کی بنیادیں اور کنٹرول تھیوری',
    'chapter-2-intro': 'باب 2 میں خوش آمدید! اس باب میں، آپ ROS 2 کی بنیادیں، URDF ماڈلنگ، کنٹرول تھیوری اور روبوٹ کو تعینات کرنے کی حکمت عملیں سیکھیں گے۔',

    // Chapter 2 Lessons (Urdu)
    'lesson-2-1-title': 'درس 2.1: ROS 2 کی بنیادیں',
    'lesson-2-2-title': 'درس 2.2: URDF ماڈلنگ',
    'lesson-2-3-title': 'درس 2.3: کنٹرول تھیوری',
    'lesson-2-4-title': 'درس 2.4: تعیناتی کی حکمت عملیں',
    'chapter-2-quiz-title': 'باب 2 کی تشخیص کوئز',

    // ========== CHAPTER 3: SIMULATION (URDU) ==========
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
    'By the end of this lesson, you will be able to:': 'اس درس کے اختتام میں، آپ یہ کر سکیں گے:',
    'Understand Gazebo architecture': 'Gazebo فن تعمیر کو سمجھیں - دنیا، ماڈلز، پلگ ان، اور فزکس انجن کیسے کام کرتے ہیں',
    'Write SDF files': 'SDF فائلیں لکھیں - روبوٹس اور ماحول کی تعریف کے لیے',
    'Configure physics engines': 'فزکس انجن کو ترتیب دیں - ODE، Bullet، Simbody میں سے منتخب کریں',
    'Control robot joints': 'روبوٹ کے مشترکات کو کنٹرول کریں - ROS 2 موضوعات کے ذریعے',
    'Detect collisions': 'ٹکراؤ کی شناخت کریں - رابطے کی حرکیات سمجھیں',
    'Visualize in RViz2': 'RViz2 میں تصور - TF2 تبدیلیاں دیکھیں',
    'Debug simulation issues': 'نقالی کے مسائل کو حل کریں - غیر مستحکم حالت کی تشخیص کریں',
    'ROS 2 Humble or Iron installed and working': 'ROS 2 Humble یا Iron نصب اور کام کر رہا ہے',
    'Gazebo Garden or Humble installed': 'Gazebo Garden یا Humble نصب (sudo apt install gazebo)',
    'gazebo-vs-real-robot': 'Gazebo بمقابلہ آپ کا حقیقی روبوٹ',
    'Below is a comparison of Gazebo simulation vs. physical robots:': 'یہاں Gazebo نقالی اور جسمانی روبوٹس کا موازنہ ہے:',
    'Key elements include physics configuration, models, links, and joints.': 'اہم عناصر میں فزکس ترتیب، ماڈلز، لنکس، اور مشترکات شامل ہیں۔',

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

    // Lesson 3.1 Detailed Content (Urdu)
    'lesson-3-1-overview': 'اس درس میں، آپ Gazebo کا استعمال کرتے ہوئے اپنے انسان نما روبوٹ کی حقیقی فزکس نقالی بنانا سیکھیں گے۔',
    'lesson-3-1-learning-duration': 'سیکھنے کا دورانیہ: 3 گھنٹے',
    'lesson-3-1-exercises': 'عملی مشقیں: 5 کوڈ مثالیں + 1 عملی منصوبہ',
    'what-is-gazebo': 'Gazebo کیا ہے؟',
    'gazebo-provides': 'Gazebo ایک روبوٹ سمیولیٹر ہے جو فراہم کرتا ہے:',
    'physics-simulation': 'فزکس نقالی: حقیقت پسندانہ مشترکہ力، رگڑ، ٹکراؤ',
    'sensor-simulation': 'سینسر نقالی: کیمرے، LiDAR، IMU، رابطہ سینسرز',
    'ros2-integration': 'ROS 2 انضمام: براہ راست موضوع/خدمت/tf2 پل',
    'plugin-system': 'پلگ ان سسٹم: فعالیت کو کسٹم اجزاء کے ساتھ بڑھائیں',
    'physics-engines': 'متعدد فزکس انجن: ODE (پہلے سے طے شدہ)، Bullet، Simbody',
    'gazebo-fundamentals': 'Gazebo کی بنیادی باتیں',
    'gazebo-architecture': 'Gazebo فن تعمیر',
    'gazebo-consists-of': 'Gazebo پر مشتمل ہے:',
    'server': 'سرور (gzserver): فزکس انجن، سینسر نقالی، پلگ ان کی تنفیذ',
    'client': 'کلائنٹ (gzclient): 3D تصور، ماؤس/کی بورڈ تاثر',
    'plugins': 'پلگ ان: کسٹم C++ کوڈ جو سرور پر چلتا ہے',
    'ros2-bridge': 'ROS 2 پل: دوطرفہ مواصلات (موضوعات، خدمات، تبدیلیاں)',
    'sdf-format': 'SDF فارمیٹ (Simulation Description Format)',
    'sdf-description': 'SDF Gazebo کی دنیا بیان کرنے کے لیے ایک XML پر مبنی فارمیٹ ہے۔',
    'sdf-elements': 'کلیدی عناصر:',
    'physics-configuration': 'فزکس انجن کی ترتیب',
    'models': 'ماڈلز (روبوٹس، چیزیں، وغیرہ)',
    'links': 'لنکس: سخت جسمیں',
    'joints': 'مشترکات: لنکس کے درمیان رابطے',
    'overview': 'جائزہ',
    'physics-accuracy': 'فزکس درستگی',
    'sensor-realism': 'سینسر حقیقت پسندی',
    'execution-speed': 'تنفیذ کی رفتار',
    'development-cycle': 'ترقیاتی چکر',
    'safety': 'حفاظت',
    'cost': 'لاگت',

    // Lesson 3.2 Detailed Content (Urdu)
    'lesson-3-2-overview': 'اس درس میں، آپ Unity اور Robotics Hub کا استعمال کرتے ہوئے بصری طور پر اپیل کرنے والی روبوٹ نقالیاں بنائیں گے۔',
    'unity-architecture': 'Unity فن تعمیر',
    'unity-rendering': 'Unity کے ساتھ اعلیٰ درجے کی رینڈرنگ',
    'pbr-materials': 'PBR مواد: جسمانی طور پر پر مبنی رینڈرنگ',
    'lighting-setup': 'روشنی کی ترتیب: حقیقت پسندانہ تصویر کے لیے',
    'camera-configuration': 'کیمرے کی ترتیب: منظور، فوکس، گہرائی کا میدان',
    'real-time-control': 'حقیقی وقت میں کنٹرول: ROS 2 سے براہ راست اپ ڈیٹس',

    // Lesson 3.3 Detailed Content (Urdu)
    'lesson-3-3-overview': 'اس درس میں، آپ NVIDIA کے جدید نقالی پلیٹ فارم کو ماسٹر کریں گے۔',
    'isaac-sim-platform': 'Isaac Sim پلیٹ فارم',
    'photorealistic-rendering': 'فوٹو حقیقت پسندانہ رینڈرنگ: RTX ray-tracing کے ساتھ',
    'reinforcement-learning': 'مشین لرننگ: کسٹم انعامات',
    'synthetic-data-generation': 'مصنوعی ڈیٹا تیاری: RGB، گہرائی، موضع، علی الحصور',
    'domain-randomization': 'ڈیٹا تبدیلی: حقیقت میں منتقلی کے لیے',
    'task-graphs': 'کام کے گراف: بصری ورق کار',
    'rl-environments': 'RL ماحول: کسٹمائز انعامات',

    // Lesson 3.4 Detailed Content (Urdu)
    'lesson-3-4-overview': 'اس درس میں، آپ حقیقت پسندانہ سینسرز کی نقالی کریں اور بڑے پیمانے پر لیبل شدہ ڈیٹاسیٹ بنائیں گے۔',
    'lidar-simulation': 'LiDAR نقالی: نقطے کے بادل اور شور ماڈل',
    'depth-camera': 'RGB-D گہرائی کیمرہ: حقیقت پسندانہ نمونے',
    'imu-simulation': 'IMU نقالی: ایکسلرومیٹر، gyroscope، تعصب اور بہاؤ',
    'data-augmentation': 'ڈیٹا اضافہ: مضبوط ML ماڈلز کے لیے',
    'export-formats': 'برآمد فارمیٹس: COCO، YOLO، ROS bags',
    'synthetic-dataset': 'مصنوعی ڈیٹاسیٹ: 5000+ لیبل شدہ امیجز',

    // Common content sections (Urdu)
    'overview-section': 'جائزہ',
    'architecture': 'فن تعمیر',
    'configuration': 'ترتیب',
    'integration': 'انضمام',
    'troubleshooting': 'مسائل کی تشخیص',
    'frequently-asked-questions': 'اکثر پوچھے جانے والے سوالات',
    'related-concepts': 'متعلقہ تصورات',
    'further-reading': 'مزید پڑھنا',
    'community': 'کمیونٹی',
    'support': 'سپورٹ',
    'contact': 'رابطہ',
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
