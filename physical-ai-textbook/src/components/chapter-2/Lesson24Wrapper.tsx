/**
 * Lesson 2.4: Deployment Strategies
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson24Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-2-4-title')}</h1>
    </header>
  );
};

export const Lesson24Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Learn strategies for deploying and operating robots in real-world environments. Cover system integration, safety considerations, monitoring, and maintenance best practices.</p>
      <p><strong>{t('estimated-time')}</strong> 60-90 minutes</p>
    </section>
  );
};

export const Lesson24LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Design deployment strategies for robots</li>
        <li>Implement safety systems and failsafes</li>
        <li>Monitor robot performance and logs</li>
        <li>Handle network communication reliability</li>
        <li>Plan maintenance schedules and procedures</li>
      </ul>
    </section>
  );
};

export const Lesson24Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-2/lesson-2-3-control-theory`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-2/chapter-2-index`} className="btn btn-primary">
        ↑ {t('back-to-overview')}
      </a>
    </nav>
  );
};

export const Lesson24: React.FC = () => {
  return (
    <>
      <Lesson24Header />
      <Lesson24Overview />
      <Lesson24LearningObjectives />
      <Lesson24Navigation />
    </>
  );
};

export default Lesson24;
