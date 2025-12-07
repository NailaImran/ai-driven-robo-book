import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Chapter 1: Foundations of Physical AI',
      items: [
        'chapter-1/chapter-1-index',
        'chapter-1/intro-to-physical-ai',
        'chapter-1/embodied-intelligence',
        'chapter-1/hardware-landscape',
        'chapter-1/lab-setup-guide',
        'chapter-1/glossary',
        'chapter-1/quiz',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: The Robotic Nervous System',
      items: [
        'chapter-2/chapter-2-index',
        'chapter-2/lesson-2-1-ros2-fundamentals',
        'chapter-2/lesson-2-2-urdf-modeling',
        'chapter-2/lesson-2-3-control-theory',
        'chapter-2/lesson-2-4-deployment',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Simulation & Digital Twins',
      items: [
        'chapter-3/chapter-3-index',
        'chapter-3/lesson-3-1-gazebo',
        'chapter-3/lesson-3-2-unity',
        'chapter-3/lesson-3-3-isaac-sim',
        'chapter-3/lesson-3-4-sensors',
        'chapter-3/chapter-3-quiz',
      ],
    },
  ],
};

export default sidebars;
