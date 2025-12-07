import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * LessonContent wrapper component for easy translation integration
 * Usage: <LessonContent tKey="lesson-3-1-overview" />
 */
interface LessonContentProps {
  tKey: string;
  defaultValue?: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export const LessonContent: React.FC<LessonContentProps> = ({
  tKey,
  defaultValue = '',
  className = '',
  as: Component = 'p'
}) => {
  const { t } = useTranslation();
  const content = t(tKey, defaultValue);

  return React.createElement(
    Component,
    { className },
    content
  );
};

/**
 * TranslationKey wrapper for text nodes
 * Simpler version for just getting translated text
 */
interface TranslationKeyProps {
  k: string;
  fallback?: string;
}

export const TKey: React.FC<TranslationKeyProps> = ({ k, fallback = '' }) => {
  const { t } = useTranslation();
  return <>{t(k, fallback)}</>;
};

/**
 * Conditional content based on language
 * Usage: <OnLanguage lang="ur"><p>اردو میں صرف</p></OnLanguage>
 */
interface OnLanguageProps {
  lang: 'en' | 'ur';
  children: React.ReactNode;
}

export const OnLanguage: React.FC<OnLanguageProps> = ({ lang, children }) => {
  const { language } = useTranslation();
  return language === lang ? <>{children}</> : null;
};

/**
 * BilingualContent - renders different content based on language
 */
interface BilingualContentProps {
  en: React.ReactNode;
  ur: React.ReactNode;
}

export const BilingualContent: React.FC<BilingualContentProps> = ({ en, ur }) => {
  const { language } = useTranslation();
  return language === 'en' ? <>{en}</> : <>{ur}</>;
};

export default LessonContent;
