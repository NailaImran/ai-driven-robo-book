/**
 * Lesson 3.1: Physics Simulation with Gazebo
 * This component wraps the lesson content to provide translations
 * Import this in the MDX file to add translation support
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson31Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-3-1-title')}</h1>
    </header>
  );
};

export const Lesson31Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>{t('lesson-3-1-overview')}</p>
      <p>
        <strong>{t('estimated-time')}</strong> {t('lesson-3-1-learning-duration')}
      </p>
      <p>
        <strong>{t('exercises')}</strong> {t('lesson-3-1-exercises')}
      </p>
    </section>
  );
};

export const Lesson31LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ol>
        <li>{t('Understand Gazebo architecture')}</li>
        <li>{t('Write SDF files')}</li>
        <li>{t('Configure physics engines')}</li>
        <li>{t('Control robot joints')}</li>
        <li>{t('Detect collisions')}</li>
        <li>{t('Visualize in RViz2')}</li>
        <li>{t('Debug simulation issues')}</li>
      </ol>
    </section>
  );
};

export const Lesson31Prerequisites: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="prerequisites">
      <h2>{t('prerequisites')}</h2>
      <ul>
        <li>{t('prereq-1')}</li>
        <li>{t('ROS 2 Humble or Iron installed and working')}</li>
        <li>{t('Gazebo Garden or Humble installed')}</li>
        <li>{t('prereq-3')}</li>
      </ul>
    </section>
  );
};

export const Lesson31KeyConcepts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="key-concepts">
      <h2>{t('key-concepts')}</h2>

      <h3>{t('what-is-gazebo')}</h3>
      <p>{t('gazebo-provides')}</p>
      <ul>
        <li>{t('physics-simulation')}</li>
        <li>{t('sensor-simulation')}</li>
        <li>{t('ros2-integration')}</li>
        <li>{t('plugin-system')}</li>
        <li>{t('physics-engines')}</li>
      </ul>

      <h3>{t('gazebo-vs-real-robot')}</h3>
      <p>{t('Below is a comparison of Gazebo simulation vs. physical robots:')}</p>
    </section>
  );
};

export const Lesson31Architecture: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="architecture">
      <h2>{t('gazebo-fundamentals')}</h2>

      <h3>{t('gazebo-architecture')}</h3>
      <p>{t('gazebo-consists-of')}</p>
      <ol>
        <li>{t('server')}</li>
        <li>{t('client')}</li>
        <li>{t('plugins')}</li>
        <li>{t('ros2-bridge')}</li>
      </ol>

      <h3>{t('sdf-format')}</h3>
      <p>{t('sdf-description')}</p>
      <p>{t('Key elements include physics configuration, models, links, and joints.')}</p>
    </section>
  );
};

export const Lesson31Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-3/chapter-3-index`} className="btn btn-primary">
        ← {t('back-to-overview')}
      </a>
      <a href={`${localePrefix}/docs/chapter-3/lesson-3-2-unity`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

/**
 * Main wrapper component for Lesson 3.1
 * Use this in the MDX file like: <Lesson31 />
 */
export const Lesson31: React.FC = () => {
  return (
    <article className="lesson-3-1">
      <Lesson31Header />
      <Lesson31Overview />
      <Lesson31LearningObjectives />
      <Lesson31Prerequisites />
      <Lesson31KeyConcepts />
      <Lesson31Architecture />
      <Lesson31Navigation />
    </article>
  );
};

export default Lesson31;
