/**
 * Lesson 3.2: High-Fidelity Rendering with Unity
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson32Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-3-2-title')}</h1>
    </header>
  );
};

export const Lesson32Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>{t('lesson-3-2-overview')}</p>
      <p>
        <strong>{t('estimated-time')}</strong> 3 hours
      </p>
      <p>
        <strong>{t('exercises')}</strong> 3 code examples + 2 practical projects
      </p>
    </section>
  );
};

export const Lesson32LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ol>
        <li>Set up Unity with Robotics Hub for ROS 2 integration</li>
        <li>Import 3D models and configure physics bodies</li>
        <li>Create photorealistic materials with PBR</li>
        <li>Design realistic lighting for simulation</li>
        <li>Publish and subscribe to ROS 2 topics in Unity</li>
        <li>Visualize real-time robot states from ROS 2</li>
      </ol>
    </section>
  );
};

export const Lesson32Prerequisites: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="prerequisites">
      <h2>{t('prerequisites')}</h2>
      <ul>
        <li>{t('prereq-1')}</li>
        <li>Unity 2022 LTS or newer installed</li>
        <li>Robotics Hub package installed in Unity</li>
        <li>ROS 2 Humble or Iron running</li>
        <li>Understanding of 3D graphics concepts</li>
      </ul>
    </section>
  );
};

export const Lesson32KeyConcepts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="key-concepts">
      <h2>{t('key-concepts')}</h2>

      <h3>{t('unity-architecture')}</h3>
      <p>{t('unity-rendering')}</p>

      <h3>{t('pbr-materials')}</h3>
      <p>PBR allows realistic material properties like metallic, roughness, and normals.</p>

      <h3>{t('lighting-setup')}</h3>
      <p>Proper lighting configuration creates photorealistic renders with shadows and reflections.</p>

      <h3>{t('real-time-control')}</h3>
      <p>Unity subscribes to ROS 2 topics for joint states and publishes commands in real-time.</p>
    </section>
  );
};

export const Lesson32RosIntegration: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="integration">
      <h2>{t('ros2-integration')}</h2>
      <p>Learn how to bridge Unity and ROS 2 for seamless robot visualization and control.</p>

      <h3>{t('camera-configuration')}</h3>
      <p>Set up cameras with proper aspect ratios, focal lengths, and clipping planes.</p>
    </section>
  );
};

export const Lesson32Navigation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <nav className="lesson-navigation">
      <a href="/docs/chapter-3/lesson-3-1-gazebo" className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href="/docs/chapter-3/lesson-3-3-isaac-sim" className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

/**
 * Main wrapper component for Lesson 3.2
 */
export const Lesson32: React.FC = () => {
  return (
    <article className="lesson-3-2">
      <Lesson32Header />
      <Lesson32Overview />
      <Lesson32LearningObjectives />
      <Lesson32Prerequisites />
      <Lesson32KeyConcepts />
      <Lesson32RosIntegration />
      <Lesson32Navigation />
    </article>
  );
};

export default Lesson32;
