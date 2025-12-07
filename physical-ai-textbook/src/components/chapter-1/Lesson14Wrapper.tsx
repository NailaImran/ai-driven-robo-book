/**
 * Lesson 1.4: Lab Setup Guide
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson14Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-1-4-title')}</h1>
    </header>
  );
};

export const Lesson14Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Design your own lab setup and make informed decisions about on-premise vs cloud infrastructure. Learn about development environments, simulation platforms, and deployment strategies.</p>
      <p><strong>{t('estimated-time')}</strong> 60-90 minutes</p>
    </section>
  );
};

export const Lesson14LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Design a development environment for robotics</li>
        <li>Evaluate on-premise vs cloud solutions</li>
        <li>Set up simulation platforms and tools</li>
        <li>Configure development workflow best practices</li>
      </ul>
    </section>
  );
};

export const Lesson14Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-1/1-3-hardware-landscape`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-1/index`} className="btn btn-primary">
        ↑ {t('back-to-overview')}
      </a>
    </nav>
  );
};

export const Lesson14: React.FC = () => {
  return (
    <>
      <Lesson14Header />
      <Lesson14Overview />
      <Lesson14LearningObjectives />
      <Lesson14Navigation />
    </>
  );
};

export default Lesson14;
