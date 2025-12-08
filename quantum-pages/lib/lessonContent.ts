// Lesson content mapping from the physical-ai-textbook
const lessonMapping: Record<string, Record<number, { title: string; description: string; fullContent?: string }>> = {
  'chapter-1': {
    1: {
      title: 'Introduction to Physical AI',
      description: 'Physical AI represents a fundamental shift from digital systems to intelligent agents that interact with the physical world through embodied hardware. Learn about the definition, evolution from 1960s industrial robotics to modern humanoids, and key applications in healthcare, manufacturing, and domestic services.'
    },
    2: {
      title: 'Embodied Intelligence',
      description: 'Explore how embodiment is crucial for true intelligence. Understand the symbol grounding problem, Moravec\'s Paradox, and why robots learn physics through real-world interaction rather than just digital data patterns.'
    },
    3: {
      title: 'Hardware Landscape',
      description: 'Survey the diverse hardware platforms powering Physical AI. From industrial arms to humanoids like Tesla\'s Optimus and Boston Dynamics\' Atlas, understand actuators, sensors, and the engineering challenges of embodied systems.'
    },
    4: {
      title: 'Lab Setup Guide',
      description: 'Get hands-on with setting up a robotics lab. Learn about essential equipment, software stack, and practical considerations for running Physical AI experiments.'
    },
    5: {
      title: 'Chapter 1 Quiz',
      description: 'Test your understanding of Physical AI fundamentals with comprehensive quiz questions covering all topics from this chapter.'
    }
  },
  'chapter-2': {
    1: {
      title: 'ROS2 Fundamentals',
      description: 'Master the Robot Operating System (ROS2), the standard middleware for robotics. Learn about nodes, topics, services, and how ROS2 enables multi-robot communication and coordination.'
    },
    2: {
      title: 'URDF Modeling',
      description: 'Discover how to represent robots as URDF (Unified Robot Description Format) files. Learn kinematics, joints, and how to model complex robotic structures.'
    },
    3: {
      title: 'Control Theory',
      description: 'Deep dive into control algorithms that translate AI decisions into physical movements. Master PID controllers, feedback loops, and motion planning strategies.'
    },
    4: {
      title: 'Deployment Strategies',
      description: 'Learn best practices for deploying robots in real-world environments. Cover safety protocols, edge computing, and continuous learning from operational data.'
    },
    5: {
      title: 'Advanced Topics',
      description: 'Explore cutting-edge developments in robot control, multi-agent systems, and distributed AI.'
    },
    6: {
      title: 'Chapter 2 Project',
      description: 'Apply all learned concepts to build a functioning robotic system. Work through a comprehensive project that integrates ROS2, control theory, and real hardware.'
    }
  },
  'chapter-3': {
    1: {
      title: 'Gazebo Simulation',
      description: 'Learn physics simulation with Gazebo, the industry-standard simulator for robotics. Understand how to build virtual environments, simulate sensors, and test algorithms before deploying to real hardware.'
    },
    2: {
      title: 'Computer Vision Basics',
      description: 'Master visual perception for robots. Learn image processing, object detection, and how computer vision feeds into robot decision-making.'
    },
    3: {
      title: 'Machine Learning for Robotics',
      description: 'Integrate ML models into robotic systems. Cover training neural networks on robot data and deploying models on edge hardware with real-time constraints.'
    },
    4: {
      title: 'Advanced Simulation',
      description: 'Explore sim-to-real transfer, high-fidelity simulation techniques, and how to validate control algorithms in simulation before real-world deployment.'
    },
    5: {
      title: 'Real-World Testing',
      description: 'Move from simulation to real hardware. Learn safety protocols, debugging techniques, and handling sim-to-real gaps.'
    },
    6: {
      title: 'Chapter 3 Capstone',
      description: 'Complete an advanced capstone project combining simulation, vision, and learning to create an autonomous robotic system.'
    },
    7: {
      title: 'Research Directions',
      description: 'Explore the frontiers of Physical AI research, emerging technologies, and opportunities for innovation.'
    }
  },
  'chapter-4': {
    1: {
      title: 'Machine Learning Fundamentals',
      description: 'Essential ML concepts for roboticists. Understand supervised learning, unsupervised learning, and reinforcement learning paradigms.'
    },
    2: {
      title: 'Neural Networks for Robotics',
      description: 'Learn how neural networks power robotic perception and control. Cover CNNs for vision, RNNs for sequential decision-making, and Transformers for complex reasoning.'
    },
    3: {
      title: 'Reinforcement Learning',
      description: 'Master learning through interaction. Understand Q-learning, policy gradients, and how robots improve performance through trial and error.'
    },
    4: {
      title: 'Transfer Learning',
      description: 'Leverage pre-trained models to accelerate robot learning. Learn domain adaptation and how to apply knowledge from one task to another.'
    },
    5: {
      title: 'Learning from Demonstrations',
      description: 'Enable robots to learn from human teachers. Cover imitation learning and how robots generalize from human demonstrations.'
    },
    6: {
      title: 'Chapter 4 Project',
      description: 'Implement a learning system that enables a robot to acquire new skills from experience and human guidance.'
    }
  },
  'chapter-5': {
    1: {
      title: 'Sensor Technologies',
      description: 'Survey the diverse sensors enabling robot perception: cameras, LiDAR, tactile sensors, IMUs, and more. Understand sensor physics and data interpretation.'
    },
    2: {
      title: 'Computer Vision',
      description: 'Deep dive into visual perception for robots. Cover image processing, object detection, pose estimation, and real-time vision pipelines.'
    },
    3: {
      title: 'Sensor Fusion',
      description: 'Learn to combine multiple sensor streams for robust perception. Master Kalman filters and multi-sensor integration techniques.'
    },
    4: {
      title: 'Proprioception and Touch',
      description: 'Understand how robots sense their own body position and forces. Learn about proprioceptive feedback for skilled manipulation.'
    },
    5: {
      title: 'Chapter 5 Lab',
      description: 'Build a complete perception pipeline that fuses multiple sensors for reliable environmental understanding.'
    }
  },
  'chapter-6': {
    1: {
      title: 'Real-World Applications',
      description: 'Explore practical deployments of Physical AI. Study case studies in manufacturing, healthcare, logistics, and domestic services.'
    },
    2: {
      title: 'Industrial Robotics',
      description: 'Learn how modern robots handle flexible manufacturing. Understand collaborative robots (cobots), safety standards, and industry adoption barriers.'
    },
    3: {
      title: 'Healthcare Robotics',
      description: 'Discover robotic surgery, rehabilitation robots, elderly care assistance, and autonomous pharmacy systems transforming healthcare.'
    },
    4: {
      title: 'Future Directions',
      description: 'Explore emerging frontiers: humanoid general-purpose robots, autonomous systems in extreme environments, and the path to AGI with embodied AI.'
    }
  }
}

export function getLessonContent(chapterId: string, lessonNumber: number) {
  const chapter = lessonMapping[chapterId]
  if (!chapter) return null
  return chapter[lessonNumber]
}

export function getChapterLessons(chapterId: string) {
  return lessonMapping[chapterId] || {}
}
