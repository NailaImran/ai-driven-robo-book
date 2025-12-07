/**
 * Lesson 1.2: Embodied Intelligence Theory
 * This component wraps the lesson content to provide translations
 */

import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Lesson12Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="lesson-header">
      <h1>{t('lesson-1-2-title')}</h1>
    </header>
  );
};

export const Lesson12Overview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="lesson-overview">
      <h2>{t('overview')}</h2>
      <p>Dive deep into the theory of embodiment - why robots need bodies, how physical interaction shapes intelligence, and the fundamental differences between digital and physical AI systems.</p>
      <p><strong>{t('estimated-time')}</strong> 45-60 minutes</p>
    </section>
  );
};

export const Lesson12LearningObjectives: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="learning-objectives">
      <h2>{t('learning-objectives')}</h2>
      <p>{t('By the end of this lesson, you will be able to:')}</p>
      <ul>
        <li>Explain embodied cognition and its role in AI development</li>
        <li>Understand how physical interaction enables learning</li>
        <li>Compare digital AI vs embodied AI approaches</li>
        <li>Recognize sensorimotor integration in intelligent systems</li>
      </ul>
    </section>
  );
};

export const Lesson12Navigation: React.FC = () => {
  const { t, language } = useTranslation();
  const localePrefix = language === 'ur' ? '/ur' : '';

  return (
    <nav className="lesson-navigation">
      <a href={`${localePrefix}/docs/chapter-1/1-1-intro-to-physical-ai`} className="btn btn-primary">
        ← {t('previous-lesson')}
      </a>
      <a href={`${localePrefix}/docs/chapter-1/1-3-hardware-landscape`} className="btn btn-primary">
        {t('next-lesson')} →
      </a>
    </nav>
  );
};

export const Lesson12: React.FC = () => {
  return (
    <>
      <Lesson12Header />
      <Lesson12Overview />
      <Lesson12LearningObjectives />
      <Lesson12Navigation />
    </>
  );
};

export default Lesson12;
