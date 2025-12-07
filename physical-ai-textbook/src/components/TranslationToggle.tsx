import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from './TranslationToggle.module.css';

export const TranslationToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleLanguage}
      title={`Switch to ${language === 'en' ? 'Urdu' : 'English'}`}
      aria-label={`Language toggle (current: ${language === 'en' ? 'English' : 'اردو'})`}
    >
      <span className={styles.icon}>
        {language === 'en' ? '🇵🇰' : '🇬🇧'}
      </span>
      <span className={styles.label}>
        {language === 'en' ? 'اردو' : 'English'}
      </span>
    </button>
  );
};

export default TranslationToggle;
