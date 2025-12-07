/**
 * Lesson 1.3: Hardware Landscape
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson13Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-1-3-title')}</h1>
    </header>
  );
};

export const Lesson13Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Explore the hardware landscape of humanoid robotics. Learn about sensors, actuators, compute platforms, and the key components that power physical AI systems.</p>
      <p><strong>{t('estimated-time')}</strong> 45-60 minutes</p>
    </section>
  );
};

export const Lesson13LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Identify key sensors (vision, IMU, force sensors)</li>
        <li>Understand actuator types and their characteristics</li>
        <li>Compare compute platform options</li>
        <li>Make informed hardware selection decisions</li>
      </ul>
    </section>
  );
};

export const Lesson13Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-1/1-2-embodied-intelligence`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-1/1-4-lab-setup-guide`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson13: React.FC = () => {
  return (
    <>
      <Lesson13Header />
      <Lesson13Overview />
      <Lesson13LearningObjectives />
      <Lesson13Navigation />
    </>
  );
};

export default Lesson13;
