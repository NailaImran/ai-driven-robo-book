/**
 * Lesson 3.3: NVIDIA Isaac Sim Platform
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson33Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-3-3-title')}</h1>
    </header>
  );
};

export const Lesson33Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>{t('lesson-3-3-overview')}</p>
      <p>
        <strong>{t('estimated-time')}</strong> 4 hours
      </p>
      <p>
        <strong>{t('exercises')}</strong> 3 code examples + 1 RL environment + synthetic data generation
      </p>
    </section>
  );
};

export const Lesson33LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ol>
        <li>Set up Isaac Sim on Omniverse (cloud or local)</li>
        <li>Import CAD models and configure physics</li>
        <li>Use RTX ray-tracing for photorealistic rendering</li>
        <li>Create reinforcement learning task environments</li>
        <li>Implement domain randomization for sim-to-real transfer</li>
        <li>Generate and export synthetic training datasets</li>
        <li>Integrate with ROS 2 for real-time control</li>
      </ol>
    </section>
  );
};

export const Lesson33Prerequisites: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="prerequisites">
      <h2>{t('prerequisites')}</h2>
      <ul>
        <li>{t('prereq-1')}</li>
        <li>NVIDIA GPU (RTX 3080+ recommended) or Omniverse Cloud access</li>
        <li>Isaac Sim 4.0+ installed</li>
        <li>NVIDIA Omniverse account</li>
        <li>Python 3.8+ with PyTorch installed</li>
      </ul>
    </section>
  );
};

export const Lesson33KeyConcepts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="key-concepts">
      <h2>{t('key-concepts')}</h2>

      <h3>{t('isaac-sim-platform')}</h3>
      <p>Isaac Sim is NVIDIA's advanced simulation platform built on Omniverse for photorealistic robotics simulation.</p>

      <h3>{t('photorealistic-rendering')}</h3>
      <p>{t('photorealistic-rendering')}</p>

      <h3>Task Graphs</h3>
      <p>{t('task-graphs')}</p>

      <h3>Reinforcement Learning</h3>
      <p>{t('reinforcement-learning')}</p>

      <h3>Domain Randomization</h3>
      <p>{t('domain-randomization')}</p>
    </section>
  );
};

export const Lesson33SyntheticData: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="synthetic-data">
      <h2>{t('Synthetic Data Generation')}</h2>

      <h3>{t('synthetic-data-generation')}</h3>
      <p>Generate large-scale labeled datasets for training perception models:</p>
      <ul>
        <li>RGB images with photorealistic lighting</li>
        <li>Depth maps and point clouds</li>
        <li>Segmentation masks and instance IDs</li>
        <li>Pose and bounding box annotations</li>
        <li>Motion blur and depth of field effects</li>
      </ul>

      <h3>Export Formats</h3>
      <p>Export data in standard formats: COCO, YOLO, ROS bags, OpenEXR</p>
    </section>
  );
};

export const Lesson33Integration: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="integration">
      <h2>{t('integration')}</h2>
      <p>Integrate Isaac Sim with ROS 2 for seamless robot control and data export.</p>

      <h3>{t('rl-environments')}</h3>
      <p>Create custom reinforcement learning environments with customizable reward functions.</p>
    </section>
  );
};

export const Lesson33Navigation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <nav className="lesson-navigation">
      <a href="/docs/chapter-3/lesson-3-2-unity" className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href="/docs/chapter-3/lesson-3-4-sensors" className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

/**
 * Main wrapper component for Lesson 3.3
 */
export const Lesson33: React.FC = () => {
  return (
    <article className="lesson-3-3">
      <Lesson33Header />
      <Lesson33Overview />
      <Lesson33LearningObjectives />
      <Lesson33Prerequisites />
      <Lesson33KeyConcepts />
      <Lesson33SyntheticData />
      <Lesson33Integration />
      <Lesson33Navigation />
    </article>
  );
};

export default Lesson33;
