import React, { useState } from 'react';
import { usePersonalization } from '../contexts/PersonalizationContext';
import styles from './PersonalizationButton.module.css';

export const PersonalizationButton: React.FC = () => {
  const { expertiseLevel, setExpertiseLevel } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setExpertiseLevel(level);
    setIsOpen(false);
  };

  return (
    <div className={styles.personalizationContainer}>
      <button
        className={styles.mainButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Personalize content based on your expertise level"
        aria-label="Content personalization menu"
      >
        <span className={styles.icon}>🎯</span>
        <span className={styles.label}>Personalize Content</span>
        <span className={styles.currentLevel}>({expertiseLevel})</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Select Your Level</h3>
            <p>Content will be tailored to your expertise</p>
          </div>

          <div className={styles.options}>
            <button
              className={`${styles.option} ${expertiseLevel === 'beginner' ? styles.selected : ''}`}
              onClick={() => handleLevelSelect('beginner')}
            >
              <span className={styles.optionIcon}>🌱</span>
              <div className={styles.optionContent}>
                <h4>Beginner</h4>
                <p>Detailed explanations, setup guides, and basic examples</p>
              </div>
              {expertiseLevel === 'beginner' && <span className={styles.checkmark}>✓</span>}
            </button>

            <button
              className={`${styles.option} ${expertiseLevel === 'intermediate' ? styles.selected : ''}`}
              onClick={() => handleLevelSelect('intermediate')}
            >
              <span className={styles.optionIcon}>📚</span>
              <div className={styles.optionContent}>
                <h4>Intermediate</h4>
                <p>Balanced content with both foundations and advanced topics</p>
              </div>
              {expertiseLevel === 'intermediate' && <span className={styles.checkmark}>✓</span>}
            </button>

            <button
              className={`${styles.option} ${expertiseLevel === 'advanced' ? styles.selected : ''}`}
              onClick={() => handleLevelSelect('advanced')}
            >
              <span className={styles.optionIcon}>🚀</span>
              <div className={styles.optionContent}>
                <h4>Advanced</h4>
                <p>Theory-focused, research papers, and advanced variations</p>
              </div>
              {expertiseLevel === 'advanced' && <span className={styles.checkmark}>✓</span>}
            </button>
          </div>

          <div className={styles.footer}>
            <p>You can change this anytime</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationButton;
