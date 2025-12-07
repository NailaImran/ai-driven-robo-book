/**
 * Lesson 2.3: Control Theory
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson23Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-2-3-title')}</h1>
    </header>
  );
};

export const Lesson23Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Understand the control theory foundations for robotics. Learn about feedback control, PID controllers, and motion planning techniques essential for commanding robots.</p>
      <p><strong>{t('estimated-time')}</strong> 90-120 minutes</p>
    </section>
  );
};

export const Lesson23LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Understand feedback control principles</li>
        <li>Implement PID controllers</li>
        <li>Design joint trajectories</li>
        <li>Apply inverse kinematics for arm control</li>
        <li>Tune controller gains for stability</li>
      </ul>
    </section>
  );
};

export const Lesson23Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-2-urdf-modeling`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-4-deployment`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson23: React.FC = () => {
  return (
    <>
      <Lesson23Header />
      <Lesson23Overview />
      <Lesson23LearningObjectives />
      <Lesson23Navigation />
    </>
  );
};

export default Lesson23;
