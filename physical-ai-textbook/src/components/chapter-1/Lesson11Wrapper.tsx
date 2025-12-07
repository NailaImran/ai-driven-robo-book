/**
 * Lesson 1.1: Introduction to Physical AI
 * This component wraps the lesson content to provide translations
 * Import this in the MDX file to add translation support
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson11Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-1-1-title')}</h1>
    </header>
  );
};

export const Lesson11Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Discover what Physical AI is, explore its historical evolution from industrial robots to modern humanoids, and understand the paradigm shift from digital to embodied intelligence.</p>
      <p><strong>{t('estimated-time')}</strong> 30-45 minutes</p>
    </section>
  );
};

export const Lesson11LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Define Physical AI and distinguish it from traditional digital AI</li>
        <li>Understand the historical evolution of robotics</li>
        <li>Identify key application domains for physical AI systems</li>
        <li>Recognize the importance of embodied intelligence</li>
      </ul>
    </section>
  );
};

export const Lesson11Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-1/index`} className="btn btn-primary">
        ← {t('back-to-overview')}
      </a>
      <a href={`${localePrefix}/docs/chapter-1/1-2-embodied-intelligence`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson11: React.FC = () => {
  return (
    <>
      <Lesson11Header />
      <Lesson11Overview />
      <Lesson11LearningObjectives />
      <Lesson11Navigation />
    </>
  );
};

export default Lesson11;
