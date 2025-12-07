import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from './TranslationToggle.module.css';

export const TranslationToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useTranslation();

  const handleLanguageSwitch = () => {
    // Toggle the language state
    toggleLanguage();

    // Get the current URL path
    const currentPath = window.location.pathname;

    // Determine the new path based on current language
    let newPath: string;

    if (language === 'en') {
      // Switching from English to Urdu: add /ur prefix
      newPath = `/ur${currentPath}`;
    } else {
      // Switching from Urdu to English: remove /ur prefix
      if (currentPath.startsWith('/ur/')) {
        newPath = currentPath.substring(3); // Remove '/ur' from the beginning
      } else {
        newPath = currentPath;
      }
    }

    // Navigate to the new locale path
    window.location.pathname = newPath;
  };

  return (
    <button
      className={styles.toggleButton}
      onClick={handleLanguageSwitch}
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
