/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main documentation sidebar
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: {
        type: 'doc',
        id: 'introduction/index',
      },
      collapsed: false,
      items: [
        'introduction/course-overview',
        'introduction/learning-outcomes',
        'introduction/why-physical-ai',
      ],
    },
    {
      type: 'category',
      label: 'Weeks 1-2: Physical AI Foundations',
      link: {
        type: 'doc',
        id: 'physical-ai-intro/index',
      },
      collapsed: true,
      items: [
        'physical-ai-intro/foundations',
        'physical-ai-intro/digital-to-physical',
        'physical-ai-intro/humanoid-landscape',
        'physical-ai-intro/sensor-systems',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 Fundamentals (Weeks 3-5)',
      link: {
        type: 'doc',
        id: 'ros2-fundamentals/index',
      },
      collapsed: true,
      items: [
        'ros2-fundamentals/architecture',
        'ros2-fundamentals/nodes-topics-services',
        'ros2-fundamentals/building-packages',
        'ros2-fundamentals/launch-files',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Robot Simulation (Weeks 6-7)',
      link: {
        type: 'doc',
        id: 'gazebo-simulation/index',
      },
      collapsed: true,
      items: [
        'gazebo-simulation/environment-setup',
        'gazebo-simulation/urdf-sdf',
        'gazebo-simulation/physics-simulation',
        'gazebo-simulation/unity-visualization',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac (Weeks 8-10)',
      link: {
        type: 'doc',
        id: 'nvidia-isaac/index',
      },
      collapsed: true,
      items: [
        'nvidia-isaac/isaac-sdk',
        'nvidia-isaac/perception-manipulation',
        'nvidia-isaac/reinforcement-learning',
        'nvidia-isaac/sim-to-real',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Humanoid Development (Weeks 11-12)',
      link: {
        type: 'doc',
        id: 'humanoid-development/index',
      },
      collapsed: true,
      items: [
        'humanoid-development/kinematics-dynamics',
        'humanoid-development/bipedal-locomotion',
        'humanoid-development/manipulation-grasping',
        'humanoid-development/human-robot-interaction',
      ],
    },
    {
      type: 'category',
      label: 'Week 13: Conversational Robotics',
      link: {
        type: 'doc',
        id: 'conversational-robotics/index',
      },
      collapsed: true,
      items: [
        'conversational-robotics/gpt-integration',
        'conversational-robotics/speech-recognition',
        'conversational-robotics/multimodal-interaction',
      ],
    },
    {
      type: 'category',
      label: 'Hardware Requirements',
      link: {
        type: 'doc',
        id: 'hardware-requirements/index',
      },
      collapsed: true,
      items: [
        'hardware-requirements/digital-twin-workstation',
        'hardware-requirements/jetson-kit',
        'hardware-requirements/robot-lab-options',
        'hardware-requirements/cloud-native-lab',
      ],
    },
    {
      type: 'category',
      label: 'Assessments',
      link: {
        type: 'doc',
        id: 'assessments/index',
      },
      collapsed: true,
      items: [
        'assessments/ros2-project',
        'assessments/gazebo-simulation',
        'assessments/isaac-perception-pipeline',
      ],
    },
    {
      type: 'category',
      label: 'Capstone Project',
      link: {
        type: 'doc',
        id: 'capstone/index',
      },
      collapsed: true,
      items: [
        'capstone/autonomous-humanoid',
        'capstone/requirements',
        'capstone/evaluation',
      ],
    },
  ],
};

module.exports = sidebars;
