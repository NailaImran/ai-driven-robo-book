/**
 * Lesson 2.1: ROS 2 Fundamentals
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson21Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-2-1-title')}</h1>
    </header>
  );
};

export const Lesson21Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Master the Robot Operating System (ROS 2) - the industry standard middleware for robotics. Learn about nodes, topics, services, and the computational graph that powers modern robots.</p>
      <p><strong>{t('estimated-time')}</strong> 60-90 minutes</p>
    </section>
  );
};

export const Lesson21LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Understand ROS 2 architecture and key concepts</li>
        <li>Create nodes and manage the computational graph</li>
        <li>Use topics for message passing between processes</li>
        <li>Implement services for synchronous communication</li>
        <li>Debug and monitor ROS 2 systems</li>
      </ul>
    </section>
  );
};

export const Lesson21Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-2/chapter-2-index`} className="btn btn-primary">
        ← {t('back-to-overview')}
      </a>
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-2-urdf-modeling`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson21: React.FC = () => {
  return (
    <>
      <Lesson21Header />
      <Lesson21Overview />
      <Lesson21LearningObjectives />
      <Lesson21Navigation />
    </>
  );
};

export default Lesson21;
