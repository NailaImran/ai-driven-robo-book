/**
 * Lesson 2.2: URDF Modeling
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson22Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-2-2-title')}</h1>
    </header>
  );
};

export const Lesson22Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Learn to create detailed robot models using URDF (Unified Robot Description Format). Design robot structures, define kinematic chains, and prepare models for simulation and visualization.</p>
      <p><strong>{t('estimated-time')}</strong> 60-90 minutes</p>
    </section>
  );
};

export const Lesson22LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Write URDF files for robot models</li>
        <li>Define links and joints properly</li>
        <li>Configure collision and visual properties</li>
        <li>Create robot manipulators and mobile bases</li>
        <li>Visualize models in RViz</li>
      </ul>
    </section>
  );
};

export const Lesson22Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-1-ros2-fundamentals`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-3-control-theory`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson22: React.FC = () => {
  return (
    <>
      <Lesson22Header />
      <Lesson22Overview />
      <Lesson22LearningObjectives />
      <Lesson22Navigation />
    </>
  );
};

export default Lesson22;
